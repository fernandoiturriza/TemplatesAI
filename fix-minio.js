import * as Minio from 'minio';
import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';

const minioClient = new Minio.Client({
  endPoint: 's3.asisteme.ai',
  useSSL: true, 
  accessKey: 'asistemeadmin',
  secretKey: 'wASJtWqrXzRahIS/vV8KL2gs+zTI6SY1'
});

const newBucket = 'asisteme-agents-skills';

async function createZip(dirPath, zipPath, exclude = []) {
    const zip = new AdmZip();
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
        if (exclude.includes(file)) continue;
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            zip.addLocalFolder(fullPath, file);
        } else {
            zip.addLocalFile(fullPath);
        }
    }
    zip.writeZip(zipPath);
    console.log(`✅ Zipped ${dirPath} to ${zipPath}`);
}

async function uploadDir(localPath, remotePrefix = '') {
  const files = fs.readdirSync(localPath);
  
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '__pycache__') continue;
    
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
    console.log('🚀 Iniciando gestión de MinIO (HTTPS)...');

    // 1. Verificar/Crear bucket
    const exists = await minioClient.bucketExists(newBucket);
    if (!exists) {
        console.log(`🏗️ Creando bucket: ${newBucket}...`);
        await minioClient.makeBucket(newBucket, 'us-east-1');
    }

    // 2. Establecer política pública
    const policy = {
      Version: '2012-10-17',
      Statement: [
        { Action: ['s3:GetBucketLocation', 's3:ListBucket'], Effect: 'Allow', Principal: { AWS: ['*'] }, Resource: [`arn:aws:s3:::${newBucket}`] },
        { Action: ['s3:GetObject'], Effect: 'Allow', Principal: { AWS: ['*'] }, Resource: [`arn:aws:s3:::${newBucket}/*`] }
      ]
    };
    await minioClient.setBucketPolicy(newBucket, JSON.stringify(policy));
    console.log('🔓 Política pública activa.');

    // 3. Crear Zips para el CLI (más eficiente que descargar archivos sueltos)
    console.log('\n📦 Preparando paquetes persistentes...');
    if (fs.existsSync('.agent')) {
        await createZip('.agent', 'agent.zip');
        await minioClient.fPutObject(newBucket, 'agent.zip', 'agent.zip');
        console.log('  -> agent.zip subido.');
        fs.removeSync('agent.zip');
    }
    
    if (fs.existsSync('masSkills')) {
        await createZip('masSkills', 'skills.zip');
        await minioClient.fPutObject(newBucket, 'skills.zip', 'skills.zip');
        console.log('  -> skills.zip subido.');
        fs.removeSync('skills.zip');
    }

    // 4. Sincronizar archivos sueltos (opcional, pero útil para inspección)
    console.log('\nSincronizando archivos individuales...');
    if (fs.existsSync('.agent')) await uploadDir('.agent', '.agent');
    if (fs.existsSync('masSkills')) await uploadDir('masSkills', 'masSkills');

    console.log('\n✨ ¡TODO LISTO! MinIO sincronizado y listo para servir.');

  } catch (err) {
    console.error('❌ Error fatal:', err);
  }
}

setupMinio();
