#!/usr/bin/env node
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import path from 'path';
import { intro, outro, spinner, note, isCancel, cancel, select, multiselect, text, confirm } from '@clack/prompts';
import pc from 'picocolors';

// Obtenemos la ruta donde está instalado globalmente este paquete
import { downloadTemplate } from 'giget';
import axios from 'axios';
import AdmZip from 'adm-zip';

import * as Minio from 'minio';
import gradient from 'gradient-string';
import { execSync } from 'child_process';
import { startGitSyncWizard } from './git-sync.js';

// Configuración de la nube de activos
const MINIO_BASE_URL = 'https://s3.asisteme.ai/asisteme-agents-skills';
const REPO_BASE = 'fernandoiturriza/asisteme-cli';

// Diseño de Banner ASCII
const BANNER_ART = `
 █████╗ ███████╗██╗███████╗████████╗███████╗███╗   ███╗███████╗
██╔══██╗██╔════╝██║██╔════╝╚══██╔══╝██╔════╝████╗ ████║██╔════╝
███████║███████╗██║███████╗   ██║   █████╗  ██╔████╔██║█████╗  
██╔══██║╚════██║██║╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║██╔══╝  
██║  ██║███████║██║███████║   ██║   ███████╗██║ ╚═╝ ██║███████╗
╚═╝  ╚═╝╚══════╝╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝╚══════╝

              ⚡ ASISTEME CLI ⚡
`;

const agkitGradient = gradient(['#4FACFE', '#00F2FE', '#007BFD']);
const divider = pc.dim(' —————————————————————————————————————————————————————————————————');

// Helper para renderizar un cuadrito de color en la terminal
const renderColor = (hex) => {
  if (!hex || !hex.startsWith('#')) return '';
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return '';
  const r = parseInt(match[1], 16);
  const g = parseInt(match[2], 16);
  const b = parseInt(match[3], 16);
  return `\x1b[48;2;${r};${g};${b}m  \x1b[0m`; // Dos espacios con el color de fondo
};

async function downloadAndExtract(url, targetDir, label = 'Descargando') {
  const s = spinner();
  s.start(label);
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer'
    });
    
    fs.ensureDirSync(targetDir);
    const zip = new AdmZip(Buffer.from(response.data));
    zip.extractAllTo(targetDir, true);
    s.stop('¡Descarga y extracción completada!');
  } catch (err) {
    s.stop('Error en la descarga');
    throw new Error(`No se pudo descargar desde ${url}: ${err.message}`);
  }
}

async function main() {
  console.clear();
  console.log(agkitGradient.multiline(BANNER_ART));
  console.log(divider);

  intro(pc.cyan('— Bienvenido al centro de control de agentes'));

  const command = process.argv[2];

  // Si se pasa un comando directo por argumento, lo ejecutamos una vez y salimos
  if (command === 'update' || command === 'skills' || command === 'gitsync') {
    await executeAction(command);
    process.exit(0);
  }

  // Bucle infinito para mantener la TUI abierta
  while (true) {
    const hasAgent = fs.existsSync(path.join(process.cwd(), '.agent'));

    // Generamos las opciones dinámicamente
    const options = [];

    if (!hasAgent) {
      options.push({ value: 'init', label: '🚀  Inicializar Multi-Agente', hint: 'Crea y configura .agent' });
    } else {
      options.push({ value: 'update', label: '🔄  Actualizar Multi-Agente', hint: 'Sincronizar .agent con la última versión.' });
      options.push({ value: 'skills', label: '🧩  Gestionar Skills', hint: 'Agregar habilidades adicionales.' });
      options.push({ value: 'context', label: '📝  Definir Contexto del Proyecto', hint: 'Configurar tecnologias del proyecto.' });
      options.push({ value: 'contribute', label: '📤  Proponer Mejoras/Agentes', hint: 'Subir tus archivos modificados al Inbox del equipo.' });
    }

    options.push({ value: 'gitsync', label: '🛸  Sincronización Git (Wizard)', hint: 'Manejo seguro de ramas y conflictos' });
    options.push({ value: 'cancel', label: '❌  Salir' });

    const action = await select({
      message: '¿Qué operación deseas realizar?',
      options: options
    });

    if (isCancel(action) || action === 'cancel') {
      outro(pc.yellow('👋 ¡Hasta luego!'));
      process.exit(0);
    }

    await executeAction(action);
    console.log(pc.dim('\n' + divider + '\n')); // Separador tras completar una acción
  }
}

async function executeAction(action) {
  const targetAgentPath = path.join(process.cwd(), '.agent');
  const s = spinner();

  if (action === 'init') {
    if (fs.existsSync(targetAgentPath)) {
      note(pc.yellow('La carpeta .agent ya existe en este proyecto.\nSi deseas bajar la última versión, usa la opción "Update Multi-Agente".'), 'Aviso');
      return; // Volvemos al bucle principal
    }

    s.start('Descargando entorno de agentes...');
    try {
      // Intentamos primero MinIO (más rápido y zip)
      await downloadAndExtract(`${MINIO_BASE_URL}/agent.zip`, targetAgentPath, 'Sincronizando desde la nube central...');
      
      // Llamada al recolector de contexto interactivo
      await collectProjectContext(targetAgentPath);

      outro(pc.green('🚀 Todo listo. ¡Tus agentes ya están disponibles en este repositorio!'));
    } catch (err) {
      s.stop('MinIO falló, intentando fallback de GitHub...');
      try {
        await downloadTemplate(`github:${REPO_BASE}/.agent`, {
            dir: targetAgentPath,
            force: true,
            preferOffline: false,
        });
        s.stop('¡Plantilla descargada desde GitHub (fallback)!');
        await collectProjectContext(targetAgentPath);
        outro(pc.green('🚀 Todo listo. (Vía GitHub)'));
      } catch (githubErr) {
        cancel(pc.red(`Error fatal: No se pudo conectar con ninguna fuente. ${githubErr.message}`));
        process.exit(1);
      }
    }
  } else if (action === 'update') {
    if (!fs.existsSync(targetAgentPath)) {
      cancel(pc.red('La carpeta .agent no existe.\nPor favor, inicializa el entorno primero.'));
      process.exit(1);
    }

    s.start('Actualizando entorno de agentes...');
    try {
      await downloadAndExtract(`${MINIO_BASE_URL}/agent.zip`, targetAgentPath, 'Sincronizando actualizaciones desde la nube...');
      s.stop('¡Entorno actualizado!');
      note('Se han sobrescrito los archivos base del entorno .agent con la última versión de la nube.', 'Aviso');
      outro(pc.green('🚀 Actualización completada satisfactoriamente.'));
    } catch (err) {
      s.stop('MinIO falló, intentando actualizar desde GitHub...');
      try {
        await downloadTemplate(`github:${REPO_BASE}/.agent`, {
            dir: targetAgentPath,
            force: true,
            preferOffline: false,
        });
        s.stop('¡Entorno actualizado desde GitHub (fallback)!');
        outro(pc.green('🚀 Actualización completada.'));
      } catch (githubErr) {
        cancel(pc.red(`Error en la actualización: ${githubErr.message}`));
        process.exit(1);
      }
    }
  } else if (action === 'skills') {
    // Para los skills, primero descargamos la carpeta masSkills a un directorio temporal
    const tempSkillsPath = path.join(process.cwd(), '.agent', '.temp_skills');
    const finalSkillsPath = path.join(process.cwd(), '.agent', 'skills');

    if (!fs.existsSync(targetAgentPath)) {
      cancel(pc.red('La carpeta .agent no existe.\nPor favor, inicializa primero.'));
      process.exit(1);
    }

    s.start('Sincronizando lista de skills disponibles...');
    try {
      if (fs.existsSync(tempSkillsPath)) fs.removeSync(tempSkillsPath);
      
      try {
        // Intentamos MinIO primero
        await downloadAndExtract(`${MINIO_BASE_URL}/skills.zip`, tempSkillsPath, 'Actualizando catálogo de habilidades...');
      } catch (minioErr) {
        s.stop('MinIO falló, intentando desde GitHub...');
        await downloadTemplate(`github:${REPO_BASE}/masSkills`, {
          dir: tempSkillsPath,
          force: true,
          preferOffline: false,
        });
      }
      s.stop('Lista de skills sincronizada.');

      const availableSkills = fs.readdirSync(tempSkillsPath)
        .filter(f => fs.statSync(path.join(tempSkillsPath, f)).isDirectory());

      if (availableSkills.length === 0) {
        fs.removeSync(tempSkillsPath);
        note('No hay skills adicionales disponibles en el repositorio.', 'Aviso');
        return;
      }

      const selectedSkills = await multiselect({
        message: 'Selecciona los skills que deseas agregar:',
        options: availableSkills.map(skill => ({ value: skill, label: skill })),
        required: false
      });

      if (isCancel(selectedSkills) || selectedSkills.length === 0) {
        fs.removeSync(tempSkillsPath);
        note('Operación cancelada. No se instalaron skills.', 'Aviso');
        return;
      }

      s.start('Inyectando skills seleccionados...');
      fs.ensureDirSync(finalSkillsPath);
      for (const skill of selectedSkills) {
        fs.copySync(path.join(tempSkillsPath, skill), path.join(finalSkillsPath, skill), { overwrite: true });
      }

      // Limpiamos la carpeta temporal
      fs.removeSync(tempSkillsPath);

      s.stop('¡Skills inyectados!');
      outro(pc.green(`🚀 Se agregaron ${selectedSkills.length} skills al proyecto.`));
    } catch (err) {
      if (fs.existsSync(tempSkillsPath)) fs.removeSync(tempSkillsPath);
      s.stop('Error sincronizando skills');
      cancel(pc.red(err.message));
      process.exit(1);
    }
  } else if (action === 'context') {
    if (!fs.existsSync(targetAgentPath)) {
      cancel(pc.red('La carpeta .agent no existe.\\nPor favor, inicializa el entorno primero.'));
      process.exit(1);
    }
    await collectProjectContext(targetAgentPath);
  } else if (action === 'gitsync') {
    await startGitSyncWizard();
  } else if (action === 'contribute') {
    await contributeToInbox();
  }
}

async function collectProjectContext(targetPath) {
  note('Vamos a configurar el contexto inicial de tu proyecto para los agentes de IA.', 'Contexto del Proyecto');

  const projectName = await text({
    message: '📦 ¿Cómo se va a llamar el proyecto?',
    initialValue: path.basename(process.cwd()),
    validate(value) {
      if (value.length === 0) return 'El nombre es requerido.';
    }
  });
  if (isCancel(projectName)) return;

  // --- Selección de Color Primario ---
  let colorPrimary;
  const primaryChoice = await select({
    message: '🎨 Selecciona el Color Primario (Brand Color):',
    options: [
      { value: '#4FACFE', label: `Azul Agkit ${renderColor('#4FACFE')}` },
      { value: '#8B5CF6', label: `Viole-Pro ${renderColor('#8B5CF6')}` },
      { value: '#10B981', label: `Vente-Verde ${renderColor('#10B981')}` },
      { value: 'custom', label: '🛠️  HEX Personalizado...' }
    ]
  });
  if (isCancel(primaryChoice)) return;

  if (primaryChoice === 'custom') {
    while (true) {
      colorPrimary = await text({
        message: 'Ingresa el código HEX (ej: #FF0000):',
        placeholder: '#4FACFE',
        validate(v) { if (!v.startsWith('#')) return 'Debe empezar con #'; }
      });
      if (isCancel(colorPrimary)) return;
      note(`Vista previa del color: ${renderColor(colorPrimary)}`, 'Preview');
      const ok = await confirm({ message: '¿Te gusta este color?', initialValue: true });
      if (ok) break;
    }
  } else {
    colorPrimary = primaryChoice;
  }

  // --- Selección de Color Secundario ---
  let colorSecondary;
  const secondaryChoice = await select({
    message: '🎨 Selecciona el Color Secundario (Accent Color):',
    options: [
      { value: '#00F2FE', label: `Aqua Light ${renderColor('#00F2FE')}` },
      { value: '#FACC15', label: `Gold Dust ${renderColor('#FACC15')}` },
      { value: '#F43F5E', label: `Sunset Red ${renderColor('#F43F5E')}` },
      { value: 'custom', label: '🛠️  HEX Personalizado...' }
    ]
  });
  if (isCancel(secondaryChoice)) return;

  if (secondaryChoice === 'custom') {
    while (true) {
      colorSecondary = await text({
        message: 'Ingresa el código HEX (ej: #00FF00):',
        placeholder: '#00F2FE',
        validate(v) { if (!v.startsWith('#')) return 'Debe empezar con #'; }
      });
      if (isCancel(colorSecondary)) return;
      note(`Vista previa del color: ${renderColor(colorSecondary)}`, 'Preview');
      const ok = await confirm({ message: '¿Te gusta este color?', initialValue: true });
      if (ok) break;
    }
  } else {
    colorSecondary = secondaryChoice;
  }

  note(
    `Paleta Seleccionada:\n` +
    `  Primario:   ${colorPrimary} ${renderColor(colorPrimary)}\n` +
    `  Secundario: ${colorSecondary} ${renderColor(colorSecondary)}`,
    'Wizard de Estilo'
  );

  const isPremium = await select({
    message: '🚀 ¿Deseas usar la arquitectura preconfigurada Premium?',
    options: [
      { value: true, label: 'Sí, usar Premium Next.js + Hono + Drizzle (Stack Asisteme)' },
      { value: false, label: 'No, prefiero elegir las tecnologías manualmente' }
    ]
  });
  if (isCancel(isPremium)) return;

  let frontend, backend, database;

  if (isPremium) {
    frontend = 'Next.js (React) - Premium';
    backend = 'Hono (Edge/Node) - Premium';
    database = 'PostgreSQL + Drizzle ORM';
  } else {
    frontend = await select({
      message: '🖥️  ¿Qué Frontend / Framework principal usarás?',
      options: [
        { value: 'Next.js (React)', label: 'Next.js (React)' },
        { value: 'React SPA (Vite)', label: 'React SPA (Vite)' },
        { value: 'Vue / Nuxt', label: 'Vue / Nuxt' },
        { value: 'Angular', label: 'Angular' },
        { value: 'Ninguno (Solo Backend/CLI)', label: 'Ninguno (Solo Backend/CLI)' }
      ]
    });
    if (isCancel(frontend)) return;

    backend = await select({
      message: '⚙️  ¿Qué Backend / API usarás?',
      options: [
        { value: 'Hono', label: 'Hono (Edge/Node)' },
        { value: 'Express', label: 'Express / Node.js' },
        { value: 'NestJS', label: 'NestJS' },
        { value: 'Next.js API Routes', label: 'Next.js API Routes (Serverless)' },
        { value: 'Ninguno (Solo Frontend/BaaS)', label: 'Ninguno (Solo Frontend/BaaS)' }
      ]
    });
    if (isCancel(backend)) return;

    database = await select({
      message: '🗄️  ¿Qué Base de Datos / BaaS usarás?',
      options: [
        { value: 'Mock Mode (Local JSON)', label: 'Mock Mode (Prototipado Rápido sin DB)' },
        { value: 'PostgreSQL + Drizzle', label: 'PostgreSQL + Drizzle ORM' },
        { value: 'PostgreSQL + Prisma', label: 'PostgreSQL + Prisma' },
        { value: 'InsForge', label: 'InsForge' },
        { value: 'Supabase / Firebase', label: 'Supabase / Firebase' },
        { value: 'SQLite local', label: 'SQLite local' },
        { value: 'Ninguna', label: 'Ninguna' }
      ]
    });
    if (isCancel(database)) return;
  }

  let dbUrl = '';
  if (database.includes('PostgreSQL') || database.includes('Supabase')) {
    dbUrl = await text({
      message: '🔗 Ingrese el Connection String de PostgreSQL (opcional, enter para omitir):',
      placeholder: 'postgresql://user:pass@localhost:5432/db'
    });
    if (isCancel(dbUrl)) return;
  }

  const scope = await text({
    message: '🎯 Breve descripción o misión del proyecto:',
    placeholder: 'Ej: Un clon de Trello con tiempo real...',
    validate(value) {
      if (value.length === 0) return 'Por favor, ingresa una breve descripción.';
    }
  });
  if (isCancel(scope)) return;

  const s = spinner();
  s.start('Aplicando configuración determinista al proyecto...');

  // 1. Modificar package.json
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = fs.readJsonSync(pkgPath);
      pkg.name = projectName.toLowerCase().replace(/\s+/g, '-');
      pkg.description = scope;
      fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
    } catch(e) {}
  }

  // 2. Modificar README.md
  const readmePath = path.join(process.cwd(), 'README.md');
  if (fs.existsSync(readmePath)) {
    try {
      let readme = fs.readFileSync(readmePath, 'utf8');
      readme = `# ${projectName}\n\n${scope}\n\n` + readme;
      fs.writeFileSync(readmePath, readme, 'utf8');
    } catch(e) {}
  } else {
    fs.writeFileSync(readmePath, `# ${projectName}\n\n${scope}\n`, 'utf8');
  }

  // 3. Modificar .env o .env.example
  if (dbUrl) {
    const envPath = fs.existsSync(path.join(process.cwd(), '.env')) 
      ? path.join(process.cwd(), '.env') 
      : path.join(process.cwd(), '.env.example');
    try {
      let envContent = '';
      if (fs.existsSync(envPath)) envContent = fs.readFileSync(envPath, 'utf8');
      
      if (!envContent.includes('DATABASE_URL')) {
        fs.appendFileSync(envPath, `\nDATABASE_URL="${dbUrl}"\n`);
      } else {
        envContent = envContent.replace(/DATABASE_URL=.*$/m, `DATABASE_URL="${dbUrl}"`);
        fs.writeFileSync(envPath, envContent);
      }
    } catch(e) {}
  }

  // 4. Inyectar CSS
  const possibleCssPaths = [
    'src/app/globals.css', 'src/index.css', 'styles/globals.css', 'app/globals.css', 'globals.css'
  ];
  for (const cssFile of possibleCssPaths) {
    const fullPath = path.join(process.cwd(), cssFile);
    if (fs.existsSync(fullPath)) {
      try {
        let css = fs.readFileSync(fullPath, 'utf8');
        if (css.includes(':root {')) {
          if (css.includes('--primary:')) {
            css = css.replace(/--primary:\s*[^;]+;/g, `--primary: ${colorPrimary};`);
            css = css.replace(/--secondary:\s*[^;]+;/g, `--secondary: ${colorSecondary};`);
          } else {
            css = css.replace(':root {', `:root {\n  --primary: ${colorPrimary};\n  --secondary: ${colorSecondary};`);
          }
          fs.writeFileSync(fullPath, css);
        }
      } catch(e) {}
    }
  }

  s.stop('Configuración de archivos aplicada.');

  // 5. Selección Modular de Agentes
  const agentsDir = path.join(targetPath, 'agents');
  const rulesDir = path.join(targetPath, 'rules');
  const targetRolesDir = fs.existsSync(rulesDir) ? rulesDir : (fs.existsSync(agentsDir) ? agentsDir : null);
  
  if (targetRolesDir) {
    const agentFiles = fs.readdirSync(targetRolesDir).filter(f => f.endsWith('.md') && !f.includes('project-rules') && !f.includes('00-orchestrator'));
    if (agentFiles.length > 0) {
      const selectedAgents = await multiselect({
        message: '🤖 ¿A quiénes quieres contratar para tu equipo de IA en este proyecto?',
        options: agentFiles.map(f => ({ value: f, label: f.replace('.md', '').replace(/-/g, ' ') })),
        required: false
      });
      
      if (!isCancel(selectedAgents)) {
        s.start('Ensamblando equipo...');
        const agentsToKeep = new Set(selectedAgents);
        let purgados = 0;
        for (const file of agentFiles) {
          if (!agentsToKeep.has(file)) {
            fs.removeSync(path.join(targetRolesDir, file));
            purgados++;
          }
        }
        s.stop(`Roles ensamblados. Elementos innecesarios eliminados: ${purgados}`);
      }
    }
  }

  if (isPremium) {
    s.start('Inyectando Skills Premium (Mock Mode, Security Center, etc.)...');
    try {
      await downloadTemplate(`github:${REPO_BASE}/masSkills/premium-nextjs-hono/skills`, {
        dir: path.join(targetPath, 'skills'),
        force: true,
      });
      s.stop('Skills Premium inyectados correctamente.');
    } catch(err) {
      s.stop('Aviso: No se pudieron descargar los Skills Premium desde GitHub (sólo disponibles cuando hagas push).');
    }
  }

  const contextContent = `# Contexto Inicial del Proyecto

- **Proyecto:** ${projectName}
- **Frontend:** ${frontend}
- **Backend:** ${backend}
- **Base de Datos:** ${database}
- **Colores Principales:** Primary (${colorPrimary}), Secondary (${colorSecondary})

## Misión / Alcance
${scope}

---
**Instrucciones para la IA:**
Por favor, lee este archivo y ejecuta inmediatamente el flujo de trabajo @[/brainstorm] para proponerme la mejor arquitectura y próximos pasos basados en estas tecnologías elegidas. No empieces a programar hasta que yo apruebe el resultado del brainstorm.
`;

  fs.writeFileSync(path.join(targetPath, 'PROJECT_CONTEXT.md'), contextContent, 'utf-8');
  note('Archivo .agent/PROJECT_CONTEXT.md generado con éxito.\n\n🤖 Dile a tu agente de IA: "Lee el PROJECT_CONTEXT.md"', 'Contexto Guardado');
}

async function contributeToInbox() {
  const minioClient = new Minio.Client({
    endPoint: 's3.asisteme.ai',
    useSSL: true, 
    accessKey: 'asistemeadmin',
    secretKey: 'wASJtWqrXzRahIS/vV8KL2gs+zTI6SY1'
  });
  const bucketName = 'asisteme-agents-skills';
  
  const targetAgentPath = path.join(process.cwd(), '.agent');
  if (!fs.existsSync(targetAgentPath)) {
    cancel('No se encontró la carpeta .agent para contribuir.');
    return;
  }

  const findFiles = (dir, allFiles = []) => {
     const files = fs.readdirSync(dir);
     for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === '.temp_skills') continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
           findFiles(fullPath, allFiles);
        } else {
           allFiles.push(path.relative(process.cwd(), fullPath));
        }
     }
     return allFiles;
  };

  const allFiles = findFiles(targetAgentPath);
  
  const selectedFiles = await multiselect({
     message: 'Selecciona los archivos que deseas proponer al equipo:',
     options: allFiles.map(f => ({ value: f, label: f })),
     required: true
  });

  if (isCancel(selectedFiles) || selectedFiles.length === 0) return;

  const s = spinner();
  s.start('Subiendo aportaciones a la nube...');
  
  let userName = 'comunidad';
  try {
     userName = execSync('git config user.name').toString().trim().replace(/\s+/g, '_');
  } catch(e) {}
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const remoteFolder = `inbox/${userName}_${timestamp}`;

  try {
     for (const file of selectedFiles) {
        const localPath = path.join(process.cwd(), file);
        const remotePath = `${remoteFolder}/${file}`.replace(/\\/g, '/');
        await minioClient.fPutObject(bucketName, remotePath, localPath);
     }
     s.stop('¡Subida completada!');
     outro(pc.green(`🚀 Se han enviado ${selectedFiles.length} archivos a revisión. ¡Gracias por contribuir, ${userName}!`));
  } catch(err) {
     s.stop('Error subiendo aportaciones.');
     cancel(err.message);
  }
}

main().catch((err) => {
  console.error(pc.red('Error crítico de ejecución:'), err);
  process.exit(1);
});
