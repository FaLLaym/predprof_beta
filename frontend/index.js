import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r123/three.min.js'
import {GLTFLoader} from "https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/loaders/GLTFLoader.js"

const canvas = document.querySelector(.webgl)
const scene = new THREE.Scene()

const loader = new GLTFLoader()
loader.load('/3d/scene.glb', function(glb){
    console.log(glb)
    const root = glb.scene;
    root.scale.set(1.3, 1.3, 1.3);

    scene.add(root);
},function(xhr){
    console.log((xhr.loader/xhr.total * 100)+"% loaded")
},function(error){
    console.log("An error occurred")
}

const plight = new THREE.DirectionalLight(0xFFFFFF, 1.2)
pLight.position.set(2, 2, 5);
scene.add(pLight) ;

const sizes = {
    width:window.innerWidth,
    height:window.innerHeight
}

var camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );
camera.position.set(0,1,40)
scene.add(camera)

const renderer = const renderer = new THREE.WebGLRenderer({
          canvas:canvas,
          alpha: true
});

renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.gammaOutput = true
renderer.render(scene,camera)


