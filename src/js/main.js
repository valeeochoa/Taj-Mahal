//TP5 - Ochoa Valentina

import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene, camActual, camaraOrtogonal, camPerspectiva, controls, arrVertices,vertices2D=[];
let tajmahl;
var tajmahl2Geo, tajmahl2Mat,objeto=0;
const movimiento = 0.5, stats = new Stats();

document.body.appendChild(stats.dom);
/**variables del ej 8 */
let maxFPS=60,tiempoMaximo = 1000 / maxFPS; //calculo del tiempo max por frame segun el fps max
let  tiempoAcumulado= 0; //tiempo entre cuadros
let ultimoTiempo = performance.now();

/** Vertices del tajmal */
vertices2D.push(0,10.7,0.0);
  vertices2D.push(0,10.5997,0.0954545);
  vertices2D.push(0,10.4325,0.0636364);
  vertices2D.push(0,10.3656,0.0318182);
  vertices2D.push(0,10.2987,0);
  vertices2D.push(0,10.165,0.127273);
  vertices2D.push(0,9.8975,0.190909);
  vertices2D.push(0,9.76375,0);
  vertices2D.push(0,9.69687,0.0636364);
  vertices2D.push(0,9.63,0.0954545);
  vertices2D.push(0,9.56312,0.159091);
  vertices2D.push(0,9.3625,0.318182);
  vertices2D.push(0,9.22875,0.509091);
  vertices2D.push(0,9.16187,0.572727);
  vertices2D.push(0,9.12844,0.636364);
  vertices2D.push(0,9.02812,0.827273);
  vertices2D.push(0,8.96125,0.7);
  vertices2D.push(0,8.89437,0.763636);
  vertices2D.push(0,8.76062,0.954545);
  vertices2D.push(0,8.42625,1.33636);
  vertices2D.push(0,8.09188,1.59091);
  vertices2D.push(0,7.69063,1.75);
  vertices2D.push(0,7.35625,1.71818);
  vertices2D.push(0,7.02187,1.59091);
  vertices2D.push(0,6.88812,1.46364);
  vertices2D.push(0,6.62063,1.46364);
  vertices2D.push(0,6.48688,1.59091);
  vertices2D.push(0,6.35313,1.46364);
  vertices2D.push(0,4.8,1.463640);
  
function init() {
 // Creo la escena principal donde se incluiran todos los elemenos.
  scene = new THREE.Scene();

  const guiCuadricula = new THREE.GridHelper(30);
  scene.add(guiCuadricula);
  const guiEjes = new THREE.AxesHelper(5);
  scene.add(guiEjes);

//Implementado la Interfaz GUI
  const gui = new dat.GUI();
  const opcionesGUI = {
      Cuadricula: true,
      Ejes: true,
      Near: 0.1,
      Far: 1000,
      FOV: 75,
      maxFPS: 60,
      CambiarCamara: function () { cambioCamara(); }
  };
  
    // Creo la camara proncipal y la posiciono.
  //Cam Perspectiva
    camPerspectiva = new THREE.PerspectiveCamera(
      opcionesGUI.FOV,
      window.innerWidth / window.innerHeight,
      opcionesGUI.Near,
      opcionesGUI.Far
  );

  // Cam Ortogonal
  const aspecto = window.innerWidth / window.innerHeight;
  camaraOrtogonal = new THREE.OrthographicCamera(
      -10 * aspecto, 10 * aspecto, 10, -10, opcionesGUI.Near, opcionesGUI.Far
  );
//Al principio la declaro perspectiva
  camActual = camPerspectiva;
  controls = new OrbitControls(camActual, renderer.domElement);

  camActual.position.set(5,5,5); //posicion de la camara en (x,y,z)
  controls.update();

  dibujoTajmahl();
  scene.add(tajmahl);

gui.add(opcionesGUI, 'Cuadricula').onChange(function(e){
    guiCuadricula.visible = e;
});
gui.add(opcionesGUI, 'Ejes').onChange(function(e){
    guiEjes.visible = e;
});
gui.add(opcionesGUI, 'Near', 0.1, 30).onChange(function (e) {
  camActual.near = e;
  camActual.updateProjectionMatrix();
});
gui.add(opcionesGUI, 'Far', 100,500).onChange(function (e) {
  camActual.far = e;
  camActual.updateProjectionMatrix();
});
gui.add(opcionesGUI, 'FOV', 30, 120).onChange(function (e) {
  if (camActual.isPerspectiveCamera) {
    camActual.fov = e;
    camActual.updateProjectionMatrix();
  }
});
gui.add(opcionesGUI, 'CambiarCamara');

gui.add(opcionesGUI, 'maxFPS',1,60).onChange(function(e){
  maxFPS = e;
  tiempoMaximo = 1000/maxFPS;
});

  //Eventos
  window.addEventListener('keydown',eventoTeclado,false );
  
}
//Parte del ejercicio 8
function rotarObjeto(){
    tajmahl.rotation.y += 0.01;
}

//Ejercicio3
function cambioCamara() {
  if (camActual.isPerspectiveCamera) {
      camActual = camaraOrtogonal;
  } else {
      camActual = camPerspectiva;
  }
  controls.object = camActual;
  camActual.position.set(5, 5,5);
  controls.update();
}


//Ejercicio2
function dibujoTajmahl(){

  const lados = 36; // cant de lados que tengo que hacer del tajmahl
  const anguloPaso = (Math.PI * 2) / lados; //angulo de paso entre los lados

  const vertices = []; //en este arreglo van a estar los vertices correspondientes al taj mahl
  for (let i = 0; i < lados; i++) {
    const anguloActual = i * anguloPaso;
    const anguloSiguiente = (i + 1) * anguloPaso; //calculo el angulo siguiente del prox lado q se haria

    for (let j = 0; j < vertices2D.length - 3; j += 3) { //es vertices2D.length -3 porque como tomo un punto y a su vez el siguiente, tengo que tener en cuenta si estoy con el ultimo vertice me tomaria a su vez el siguiente que seria basura, entonces en el anteultimo vertice tendria que terminar el for es decir vertices2D.length -3
      // vertices base A
      const xA = vertices2D[j];
      const yA = vertices2D[j + 1];
      const zA = vertices2D[j + 2];
      // vertices base B 
      const xB = vertices2D[j + 3];
      const yB = vertices2D[j + 4];
      const zB = vertices2D[j + 5];
      
      // los roto manualmente
      //A
      const xARotado = xA * Math.cos(anguloActual) - zA * Math.sin(anguloActual);
      const zARotado = xA * Math.sin(anguloActual) + zA * Math.cos(anguloActual);
      //B
      const xBRotado = xB * Math.cos(anguloActual) - zB * Math.sin(anguloActual);
      const zBRotado = xB * Math.sin(anguloActual) + zB * Math.cos(anguloActual);
      
      //A'
      const xARotadoSiguiente = xA * Math.cos(anguloSiguiente) - zA * Math.sin(anguloSiguiente);
      const zARotadoSiguiente = xA * Math.sin(anguloSiguiente) + zA * Math.cos(anguloSiguiente);
      //B'
      const xBRotadoSiguiente = xB * Math.cos(anguloSiguiente) - zB * Math.sin(anguloSiguiente);
      const zBRotadoSiguiente = xB * Math.sin(anguloSiguiente) + zB * Math.cos(anguloSiguiente);

      //generalizo para que realice correctamente los triangulos de la figura
      // triangulo 1  (A, B, A')
      vertices.push(xARotado, yA, zARotado); // A
      vertices.push(xBRotado, yB, zBRotado); // B
      vertices.push(xARotadoSiguiente, yA, zARotadoSiguiente); // A'

      //triangulo 2 (B , B', A')
      vertices.push(xBRotado, yB, zBRotado); // B
      vertices.push(xBRotadoSiguiente, yB, zBRotadoSiguiente); // B'
      vertices.push(xARotadoSiguiente, yA, zARotadoSiguiente); // A'
    }
  }
  arrVertices = new Float32Array(vertices); //agrego los vertices finales
  //creacion del objeto
  tajmahl2Geo = new THREE.BufferGeometry();
  tajmahl2Geo.setAttribute('position', new THREE.BufferAttribute(arrVertices, 3) );

  tajmahl2Mat= new THREE.MeshBasicMaterial({
    color: 'rgb(0,0,255)',
    wireframe: true,
    depthTest: true //azul
  });
  //malla = (geometria+material)
  tajmahl = new THREE.Mesh(tajmahl2Geo,tajmahl2Mat);
  tajmahl.position.y = -4.79;
} 


//Ejercicio 3- Eventos del teclado
function eventoTeclado(event){
  switch(event.key){
    case 'w':
      camActual.position.y += movimiento; break;
    case 's':
      camActual.position.y -= movimiento; break;
    case 'a':
      camActual.position.x += movimiento; break;
    case 'd':
      camActual.position.x -= movimiento; break; 
    case 'q':
      camActual.position.z += movimiento; break;
    case 'e':   
      camActual.position.z -= movimiento; break;
  }
  
}


function buclePrincipal() {

  stats.begin();
  let tiempoActual = performance.now();//guardo el tiempo actual
  let calculoTiempo = tiempoActual - ultimoTiempo; //calculo el tiempo
  tiempoAcumulado += calculoTiempo; //actualizo el tiempo acumulado con el calculo de tiempo
  
  //actualizo el tiempo
  ultimoTiempo = tiempoActual;

  //renderizo solo si el tiempo acumulado es mayor o igual al tiempo max 
  if(tiempoAcumulado >= tiempoMaximo){
   
    rotarObjeto(); //rota solo el taj mahl y los 3 objetos- NO los planos
    controls.update();
    renderer.render(scene, camActual);
    tiempoAcumulado %= tiempoMaximo; //resto el tiempo del renderizado
  
  }
  requestAnimationFrame(buclePrincipal); //recursividad
  stats.end();
}
init();
buclePrincipal();
