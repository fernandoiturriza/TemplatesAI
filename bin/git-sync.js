import { execSync } from 'child_process';
import readline from 'readline';
import { select, text, isCancel, cancel, note, confirm } from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs';

// Lista de correos con permisos de Administrador para Producción (main/master)
const AUTHORIZED_EMAILS = [
  'juan.guadama@gmail.com',
  'asistemeai@gmail.com' 
];

function ensureBuild() {
  console.log(pc.dim('\n🏗️  Ejecutando npm run build preventivo antes del push...'));
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log(pc.green('✅ Build exitoso. El código es seguro para subir.\n'));
  } catch (e) {
    cancel('El build ha fallado. Abortando operación para no subir código roto.');
    process.exit(1);
  }
}

function verifyAdminEmail() {
  try {
    const email = execSync('git config user.email').toString().trim();
    if (!AUTHORIZED_EMAILS.includes(email) && !email.includes('admin')) {
      cancel(`ALERTA DE SEGURIDAD: Tu email de git (${email}) carece de privilegios para fusionar código en producción (main/master).`);
      process.exit(1);
    }
  } catch (e) {
    cancel('No se pudo validar tu administrador git.');
    process.exit(1);
  }
}

function run(cmd, exitOnError = true) {
  try {
    console.log(pc.dim(`> ${cmd}`));
    return execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    if (exitOnError) {
      cancel(`Error fatal ejecutando: ${cmd}. Secuencia interactiva Abortada.`);
      process.exit(1);
    }
    return error;
  }
}

async function promptForCommit(defaultMsg = "Update general automático") {
  const ans = await text({
    message: '📝 Mensaje del Commit',
    placeholder: defaultMsg,
    initialValue: '',
  });
  
  if (isCancel(ans)) {
    cancel('Operación cancelada.');
    process.exit(0);
  }
  return ans.trim() || defaultMsg;
}

async function handleConflicts() {
  note('🚨🚨🚨 ALERTA DE CONFLICTO DETECTADA 🚨🚨🚨', 'Atención');
  
  let conflictedFiles = [];
  try {
    const out = execSync('git diff --name-only --diff-filter=U', { stdio: 'pipe' }).toString();
    conflictedFiles = out.trim().split('\n').filter(Boolean);
  } catch (err) {}

  if (conflictedFiles.length > 0) {
    console.log(pc.yellow(`\n📋 Se encontraron conflictos en ${conflictedFiles.length} archivo(s). Resolvámolos paso a paso:`));
    
    for (const file of conflictedFiles) {
      // ---- VISUALIZADOR DE DIFFS (Lectura de marcadores) ----
      try {
        const fileText = fs.readFileSync(file, 'utf8');
        const lines = fileText.split('\n');
        let conflictOccurrences = 0;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith('<<<<<<<')) {
            if (conflictOccurrences === 0) console.log(pc.cyan(`\n=== 👁️  MOSTRANDO LÍNEAS EN CONFLICTO: ${file} ===`));
            conflictOccurrences++;
            console.log(pc.red('\n--- 🔴 1. MI VERSIÓN LOCAL (Tu código actual) ---'));
            let j = i + 1;
            while(lines[j] && !lines[j].startsWith('=======')) {
                console.log(`  ${lines[j]}`);
                j++;
            }
          } else if (line.startsWith('=======')) {
            console.log(pc.blue('\n--- 🔵 2. VERSIÓN ENTRANTE (De interactuar con Develop) ---'));
            let j = i + 1;
            while(lines[j] && !lines[j].startsWith('>>>>>>>')) {
                console.log(`  ${lines[j]}`);
                j++;
            }
            console.log(pc.cyan('\n========================================================'));
          }
        }
      } catch(e) {}
      // ----------------------------------------------------
      
      const choice = await select({
        message: `👉 ¿Qué hacemos con [${file}]?`,
        options: [
          { value: '1', label: 'Quedarme con MI VERSIÓN local (--ours)' },
          { value: '2', label: 'Aceptar versión ENTRANTE de develop (--theirs)' },
          { value: '3', label: 'Resolver MANUALMENTE en el editor (abrir y limpiar las <<<<)' }
        ]
      });

      if (isCancel(choice)) {
        cancel('Operación cancelada.');
        process.exit(0);
      }
        
      if (choice === '1') {
        run(`git checkout --ours "${file}"`);
        run(`git add "${file}"`);
        console.log(pc.green(`✅ Mantuviste tu versión de ${file}.\n`));
      } else if (choice === '2') {
        run(`git checkout --theirs "${file}"`);
        run(`git add "${file}"`);
        console.log(pc.green(`✅ Aceptaste la versión entrante para ${file}.\n`));
      } else if (choice === '3') {
        console.log(`\nABRE EL ARCHIVO EN TU EDITOR: ${file}`);
        console.log(`Limpia las marcas de conflicto (<<<< ==== >>>>) y GUARDA con Ctrl+S.`);
        
        // Wait for user to press ENTER
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        await new Promise(resolve => rl.question(pc.magenta(`👉 Presiona ENTER aquí ÚNICAMENTE cuando hayas terminado de editar...`), () => {
          rl.close();
          resolve();
        }));

        run(`git add "${file}"`);
        console.log(pc.green(`✅ Archivo marcado como resuelto.\n`));
      }
    }
  } else {
    note('Ups! Tienes código que choca directamente y Git pide tu atención.\n1. Abre tu código en VS Code o Cursor.\n2. Resuelve manualmente y Guarda.', 'Conflictos manuales');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await new Promise(resolve => rl.question(pc.magenta('\n👉 ¡ALTO! Presiona ENTER únicamente cuando hayas reparado todo...'), () => {
      rl.close();
      resolve();
    }));
    run('git add .', false);
  }
  
  console.log(pc.green('\n✅ Terminando la resolución del Merge...'));
  try {
    run('git commit -m "Merge interactivo de conflictos resuelto desde la terminal"', false);
  } catch(e) { } 
}

// ============== RUTINAS ==============

async function doBackup(branch) {
  ensureBuild(); 
  
  const msg = await promptForCommit();
  run('git add .');
  run(`git commit -m "${msg}"`, false);

  console.log(pc.cyan('\n☁️ Subiendo a la nube (Personal)...'));
  run(`git push origin ${branch}`, false);
  console.log(pc.green('✅ Respaldo exitoso local y en la nube.\n'));
}

async function doPullDevelop(branch) {
  ensureBuild(); 

  console.log(pc.cyan('\n📥 Acoplando cambios sanos de origin/develop...'));
  try {
    execSync('git pull origin develop --no-edit', { stdio: 'inherit' });
    console.log(pc.green('✅ Actualizado desde Develop sin conflictos.\n'));
  } catch (e) {
    await handleConflicts();
    console.log(pc.green('✅ Conflictos superados de develop en tu rama.\n'));
  }
}

async function doFullSync(branch) {
  ensureBuild(); 

  const msg = await promptForCommit();
  run('git add .');
  run(`git commit -m "${msg}"`, false);
  
  console.log(pc.cyan('\n🛡️ Fase 1: Previniendo choques...'));
  try {
    execSync('git pull origin develop --no-edit', { stdio: 'inherit' });
  } catch (e) {
    await handleConflicts();
  }

  console.log(pc.cyan(`\n☁️ Fase 2: Respaldando [${branch}] en la matriz original...`));
  run(`git push origin ${branch}`, false);
  
  const doDevelopMerge = await confirm({
    message: '👉 ¿Confirmas que deseas inyectar estos cambios en "develop"? (Cualquier integrante puede)',
    initialValue: true
  });
  
  if (isCancel(doDevelopMerge)) {
    cancel('Operación cancelada.');
    process.exit(0);
  }

  if (doDevelopMerge) {
    console.log(pc.cyan('\n🔄 Fase 3: Viajando a Develop...'));
    run('git switch develop');
    run('git pull origin develop --no-edit', false);
    
    console.log(pc.cyan(`\n🧬 Fase 4: Ejecutando Inyección Genética (${branch} -> develop)...`));
    run(`git merge ${branch} --no-edit`);
    run('git push origin develop');
  } else {
    console.log(pc.yellow('\n✅ Merge a develop CANCELADO a tu solicitud.'));
  }
  
  console.log(pc.cyan(`\n🏠 Fase 5: Regresando a casa (${branch})...`));
  run(`git switch ${branch}`);
  
  note('¡PROCESO DE SINCRONIZACIÓN EXITOSO! 🚀', 'Éxito');
}

async function doDeployToMain(branch) {
  console.log(pc.red('\n🚨 Estas solicitando un pase a PRODUCCIÓN (main/master)'));
  verifyAdminEmail();
  
  ensureBuild();

  const isConfirmed = await confirm({
    message: '👉 ESTÁS A PUNTO DE ALTERAR EL CÓDIGO DE PRODUCCIÓN. ¿Continuar con merge?',
    initialValue: false
  });

  if (isCancel(isConfirmed) || !isConfirmed) {
    cancel('Abortado. Manteniendo seguridad de producción.');
    process.exit(0);
  }

  console.log(pc.cyan('\n🚀 Desplegando en Producción...'));
  run('git switch main');   
  run('git pull origin main --no-edit');
  run('git merge develop --no-edit');
  run('git push origin main');
  run(`git switch ${branch}`);
  note('¡DESPLIEGUE A PRODUCCIÓN EXITOSO!', 'Éxito');
}

// ============== BOOTSTRAP ==============

export async function startGitSyncWizard() {
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    if (currentBranch === 'develop' || currentBranch === 'main') {
      cancel('ESTÁS EN UNA RAMA GLOBAL. Cambia a tu rama personal (git checkout) antes de sincronizar.');
      return;
    }

    const answer = await select({
      message: `🤖 AGENTIC DEV-SYNC WIZARD [Rama: ${currentBranch}]\n¿Misión de vuelo para hoy?`,
      options: [
        { value: '1', label: 'Respaldo Simple   : Añade y guarda tu código sin fusionarlo con nadie.' },
        { value: '2', label: 'Traer de Develop  : Solamente descarga lo que han hecho tus compañeros hacia aquí.' },
        { value: '3', label: 'Merge (Todo en 1) : Respalda tu rama, baja actualizaciones y OPCIONALMENTE se suma en develop.' },
        { value: '4', label: 'Pase a Producción : Merge de develop a main/master (SÓLO AUTORIZADOS).' },
        { value: 'cancel', label: '❌ Cancelar y volver al menú principal' }
      ]
    });

    if (isCancel(answer) || answer === 'cancel') {
      note('Operación cancelada. Cerrando bahía de despegue.', 'Aviso');
      return;
    }

    switch (answer) {
      case '1':
        await doBackup(currentBranch);
        break;
      case '2':
        await doPullDevelop(currentBranch);
        break;
      case '3':
        await doFullSync(currentBranch);
        break;
      case '4':
        await doDeployToMain(currentBranch);
        break;
      default:
        cancel('Comando desconocido. Cerrando bahía de despegue.');
        break;
    }
  } catch (e) {
    if (e.message.includes('not a git repository')) {
      cancel('No se encontró un repositorio git en el directorio actual.');
    } else {
      console.error(pc.red('Error no controlado reconociendo git o consola terminal:'), e);
    }
  }
}
