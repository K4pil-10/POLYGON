import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
// import { fill } from 'three/src/extras/TextureUtils.js';

const scene = new THREE.Scene();
scene.background= new THREE.Color(0x050b1a)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(-3, 0, 30)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled= true;

// Controls

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate= false;
controls.enableZoom =true;
controls.enablePan= true;
controls.zoomSpeed= 1.2;
controls.rotateSpeed= 1.0;

// Light System

const ambientLight= new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10,20,5);
directionalLight.castShadow= true;
directionalLight.receiveShadow= true;
directionalLight.shadow.mapSize.width= 1024;
directionalLight.shadow.mapSize.height=1024;
scene.add(directionalLight);

const fillLight= new THREE.PointLight(0x4466cc, 0.3);
fillLight.position.set(0, -10, 0);
scene.add(fillLight)

const rimLight= new THREE.PointLight(0xffaa66, 0.5);
rimLight.position.set(-5,5,-10);
scene.add(rimLight);

const followLight =new THREE.PointLight(0xff6633, 0.8, 30);
followLight.castShadow = true;
scene.add(followLight);

const hemiLight = new THREE.HemisphereLight(0x88aaff, 0x332211, 0.5);
scene.add(hemiLight);


// Torus

const torusGeometry= new THREE.TorusGeometry(5,0.4,128,200);
const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0xff6637,
  emissive: 0x331100,
  roughness: 0.2,
  metalness: 0.9,
  emissiveIntensity: 0.4
});

const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.castShadow= true;
torus.receiveShadow= false;
scene.add(torus);

// Bicycle Model

const cycleTexture = new THREE.TextureLoader().load('bicycle.jpg');
const normalTexture= new THREE.TextureLoader().load('normal.jpg');
const bicycleMaterial= new THREE.MeshStandardMaterial({
  map: cycleTexture,
  normalMap: normalTexture,
  roughness: 0.4,
  metalness: 0.6,
  emissive: 0x221100,
  emissiveIntensity: 0.1,
  color: 0xffaa66
});

cycleTexture.addEventListener('error', ()=>{
  bicycleMaterial.map = null;
  bicycleMaterial.color.setHex(0xff884d);
  bicycleMaterial.emissiveIntensity = 0.3;
  bicycleMaterial.needsUpdate= true;
});

const bicycle = new THREE.Mesh(
  new THREE.BoxGeometry(6, 6, 6),
  bicycleMaterial
);
bicycle.position.set(-10,0,5);
bicycle.castShadow= true;
bicycle.receiveShadow= true;
scene.add(bicycle);

const bicycleRingGeometry = new THREE.TorusGeometry(5, 0.,128,200);
const bicycleRingMaterial= new THREE.MeshStandardMaterial({
  map:cycleTexture,
  color: 0xff6637,
  emissive: 0x331100,
  roughness: 0.2,
  emissiveIntensity: 0.4,
});
const bicycleRing= new THREE.Mesh(bicycleRingGeometry, bicycleRingMaterial);
bicycle.add(bicycleRing);

//Ronaldo model

const cr7Texture = new THREE.TextureLoader().load('ronaldo.png');
const ronaldoMaterial = new THREE.MeshStandardMaterial({
  map: cr7Texture,
  roughness:0.3,
  metalness: 0.1,
  emissive: 0x221100,
  emissiveIntensity: 0.1
});

const ronaldo = new THREE.Mesh(
  new THREE.BoxGeometry(6,6,6),
  ronaldoMaterial
);

ronaldo.castShadow= true;
ronaldo.position.set(0, 0, 0);
scene.add(ronaldo);


// Star system

const starCount= 800;
const starGeometry= new THREE.BufferGeometry();
const starPositions= new Float32Array(starCount * 3);
const starColors= new Float32Array(starCount * 3);

for (let i = 0; i <starCount; i++){
  const radius = 150;
  const theta= Math.random() * Math.PI *2;
  const phi= Math.acos(2 * Math.random() -1);

  starPositions[i *3] = radius * Math.sin(phi) * Math.cos(theta);

  starPositions[i *3 +1]= radius * Math.sin(phi) * Math.sin(theta);

  starPositions[i * 3 +2]= radius * Math.cos(phi);

const colorChoice= Math.random();
if(colorChoice > 0.8){
  starColors[i *3]= Math.random() * 0.5 + 0.5;
  starColors[i *3 +1]= Math.random() * 0.3;
  starColors[i *3 +2]= Math.random() * 0.3;

  } else if(colorChoice >0.6){
  starColors[i *3]= Math.random() * 0.3;
  starColors[i *3 +1]= Math.random() * 0.5 +0.5;
  starColors[i *3 +2]= Math.random() * 0.3;
  } else{
  starColors[i * 3] = 1; 
  starColors[i * 3 + 1] = 1;
  starColors[i * 3 + 2] = 1;
  }

}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

const starMaterial= new THREE.PointsMaterial({
  size: 1.5,
  vertexColors: true,
  transparent:true,
  opacity:0.8,
  blending: THREE.AdditiveBlending
});

const stars= new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

//Twinkling effect

const twinkleCount= 400;
const twinkleGeometry= new THREE.BufferGeometry();
const twinklePositions= new Float32Array(twinkleCount *3);

for (let i=0; i<twinkleCount; i++){
  twinklePositions[i*3]= THREE.MathUtils.randFloatSpread(200);
  twinklePositions[i*3+1]= THREE.MathUtils.randFloatSpread(100);
  twinklePositions[i*3+2]= THREE.MathUtils.randFloatSpread(150)-50;
}

twinkleGeometry.setAttribute('position', new THREE.BufferAttribute(twinklePositions,3));

const twinkleMaterial= new THREE.PointsMaterial({
  color: 0xaaffff,
  size: 0.15,
  transparent:true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending
});

const twinklingStars= new THREE.Points(twinkleGeometry, twinkleMaterial);
scene.add(twinklingStars);


// Floating Particles

const particleCount= 1000;
const particleGeometry= new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleVelocities= [];

for (let i= 0; i<particleCount; i++){
  particlePositions[i * 3] = THREE.MathUtils.randFloatSpread(60);
  particlePositions[i * 3 +1] = THREE.MathUtils.randFloatSpread(40);
  particlePositions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(80)-20;

  particleVelocities.push({
    x: (Math.random() - 0.5) * 0.02,
    y: (Math.random() - 0.5) * 0.02,
    z: (Math.random() - 0.5) * 0.02
  });
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particalMaterial = new THREE.PointsMaterial({
  color: 0xffaa77,
  size: 0.08,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particleGeometry, particalMaterial);
scene.add(particles);

// Animation state
let targetX= 0;
let targetY= 0;
let targetZ=30;
let time= 0;

//Scroll Handler

function moveCamera(){

  const t= document.body.scrollTop || document.documentElement.scrollTop;
  const maxScroll= document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = t / maxScroll;

// Smooth camera movement
  targetZ= 30 - scrollPercent * 25;
  targetX=scrollPercent *5 -3;
  targetY=scrollPercent *3;

  // Bicycle rotation and movement
  if(bicycle){

    bicycle.rotation.x = scrollPercent * Math.PI *2;
    bicycle.rotation.y = scrollPercent * Math.PI *1.5;
    bicycle.rotation.z = scrollPercent * Math.PI;  

    const angle= scrollPercent *Math.PI*2;
    const radius= 15;
    bicycle.position.x = -10 + Math.sin(angle) * radius * 0.1;
    bicycle.position.z = 5 + Math.cos(angle) * radius * 0.1;
  }

  if(ronaldo){
    ronaldo.rotation.y= scrollPercent * Math.PI*2;
    ronaldo.position.y= Math.sin(scrollPercent * Math.PI * 4)*1;
  }

}

let scrolling = false;
window.addEventListener('scroll', ()=>{
  if(!scrolling){
    requestAnimationFrame(()=>{
      moveCamera();
      scrolling=false;
    });
    scrolling= true;
  }
});
moveCamera();

const spaceTextureLoader= new THREE.TextureLoader();
spaceTextureLoader.load('map.png',(texture)=>{
  scene.background=texture;
  },
  undefined,(err)=>{
    const canvas= document.createElement('canvas');
    canvas.width=512;
    canvas.height= 512;
    const ctx= canvas.getContext('2d');
    const gradient= ctx.createLinearGradient(0,0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#050b1a');
    gradient.addColorStop(0.5, '#0a1a3a');
    gradient.addColorStop(1, '#1a0a2a');
    ctx.fillStyle= gradient;
    ctx.fillRect(0,0,canvas.width, canvas.height);
    const gradientTexture= new THREE.CanvasTexture(canvas);
    scene.background= gradientTexture;
  }
);

// ANIMATE LOOP

function animate(){
  requestAnimationFrame(animate);
  time += 0.016;

  torus.rotation.x += 0.003;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.002;

  bicycleRing.rotation.x += 0.003;
  bicycleRing.rotation.y += 0.005;
  bicycleRing.rotation.z += 0.002;

  torus.position.y = Math.sin(time * 0.5)* 0.5;

  stars.rotation.y += 0.0005;
  stars.rotation.x += 0.0003;
  twinklingStars.rotation.y -= 0.0002;

  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i< particleCount; i++){

    positions[i * 3]+= particleVelocities[i].x;
    positions[i * 3 +1]+= particleVelocities[i].y;
    positions[i * 3 + 2]+= particleVelocities[i].z;

    if(Math.abs(positions[i *3]) > 60) positions[i  *3] *= -0.9;

    if(Math.abs(positions[i *3 + 1]) > 40) positions[i  *3 +1] *= -0.9;

    if(Math.abs(positions[i *3+ 2] +20) > 80) positions[i  *3 +2] *= -0.9;
  }
    particles.geometry.attributes.position.needsUpdate = true;

  if(bicycle){
    followLight.position.lerp(bicycle.position, 0.05);
    followLight.intensity=0.6 + Math.sin(time *5) * 0.2;
  }

  camera.position.z += (targetZ - camera.position.z) * 0.08;
  camera.position.x += (targetX - camera.position.x) * 0.08;
  camera.position.y += (targetY - camera.position.y) * 0.08;

  controls.update();
  renderer.render(scene, camera);

}

animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  renderer.shadowMap.enabled = false;
}

