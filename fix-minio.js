import * as Minio from 'minio';
import fs from 'fs-extra';
import path from 'path';

const minioClient = new Minio.Client({
  endPoint: 'minio.asisteme.ai',
  port: 9000, 
  useSSL: true, 
  accessKey: 'asistemeadmin',
  secretKey: 'wASJtWqrXzRahIS/vV8KL2gs+zTI6SY1'
});

const newBucket = 'asisteme-cli-assets';

async function uploadDir(localPath, remotePrefix = '') {
  const files = fs.readdirSync(localPath);
  
  for (const file of files) {
    const fullPath = path.join(localPath, file);
    const remotePath = path.join(remotePrefix, file).replace(/\\/g, '/'); // Normalizar para S3

    if (fs.statSync(fullPath).isDirectory()) {
      await uploadDir(fullPath, remotePath);
    } else {
      console.log(`  -> Subiendo: ${remotePath}...`);
      await minioClient.fPutObject(newBucket, remotePath, fullPath);
    }
  }
}

async function setupMinio() {
  try {
    console.log('🚀 Iniciando gestión de MinIO por puerto 443 (HTTPS)...');

    // 1. Crear el bucket (si no existe)
    try {
        const exists = await minioClient.bucketExists(newBucket);
        if (!exists) {
            console.log(`🏗️ Creando bucket: ${newBucket}...`);
            await minioClient.makeBucket(newBucket, 'us-east-1');
            console.log('✅ Bucket creado.');
        } else {
            console.log('💡 El bucket ya existe.');
        }
    } catch (e) {
        // Si bucketExists falla por región, intentamos crearlo de todos modos
        console.log('⚠️ No se pudo verificar existencia, intentando crear bucket...');
        await minioClient.makeBucket(newBucket, 'us-east-1').catch(() => console.log('💡 El bucket posiblemente ya existe o error al crear.'));
    }

    // 2. Establecer política pública (ReadOnly)
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['s3:GetBucketLocation', 's3:ListBucket'],
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Resource: [`arn:aws:s3:::${newBucket}`]
        },
        {
          Action: ['s3:GetObject'],
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Resource: [`arn:aws:s3:::${newBucket}/*`]
        }
      ]
    };
    await minioClient.setBucketPolicy(newBucket, JSON.stringify(policy));
    console.log('🔓 Política pública (ReadOnly) establecida.');

    // 3. Subir carpetas
    console.log('\n📦 Subiendo archivos base...');
    
    // Subir .agent
    const agentLocal = path.join(process.cwd(), '.agent');
    if (fs.existsSync(agentLocal)) {
      console.log('📁 Sincronizando carpeta .agent...');
      await uploadDir(agentLocal, '.agent');
    }

    // Subir masSkills
    const skillsLocal = path.join(process.cwd(), 'masSkills');
    if (fs.existsSync(skillsLocal)) {
      console.log('📁 Sincronizando carpeta masSkills...');
      await uploadDir(skillsLocal, 'masSkills');
    }

    console.log('\n✨ ¡TODO LISTO! El bucket "asisteme-cli-assets" está sincronizado.');

  } catch (err) {
    console.error('❌ Error fatal:', err);
  }
}

setupMinio();
