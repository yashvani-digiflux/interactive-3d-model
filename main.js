import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Create a cube
const geometry = new THREE.BoxGeometry();
// Create a cube with different colors on each face
const materials = [
  new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Front (Red)
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Back (Green)
  new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Top (Blue)
  new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Bottom (Yellow)
  new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Right (Magenta)
  new THREE.MeshBasicMaterial({ color: 0x00ffff }), // Left (Cyan)
];

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// Create a group to hold the cube and labels
const group = new THREE.Group();
scene.add(group);

// Create labels and arrows
const labels = [];
const lines = [];

function createLabelAndLine(text, color, position, direction) {
  const labelCanvas = document.createElement("canvas");
  const context = labelCanvas.getContext("2d");
  context.font = "Bold 24px Arial";
  context.fillStyle = "white";
  context.fillText(text, 0, 24);
  const labelTexture = new THREE.CanvasTexture(labelCanvas);

  const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
  const labelSprite = new THREE.Sprite(labelMaterial);
  labelSprite.scale.set(1, 0.5, 1);
  labelSprite.position.copy(position);
  group.add(labelSprite);
  labels.push(labelSprite);

  const lineGeometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    0,
    0,
    0,
    direction.x,
    direction.y,
    direction.z,
  ]);
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  group.add(line);
  lines.push(line);

  labelSprite.onClick = () => {
    line.visible = !line.visible; // Toggle line visibility on label click
  };
}

createLabelAndLine(
  "Front (Magenta)",
  0xff00ff,
  new THREE.Vector3(0, 0, 2),
  new THREE.Vector3(0, 0, 1)
);
createLabelAndLine(
  "Back (Cyan)",
  0x00ffff,
  new THREE.Vector3(0, 0, -2),
  new THREE.Vector3(0, 0, -1)
);
createLabelAndLine(
  "Top (Blue)",
  0x0000ff,
  new THREE.Vector3(0, 2, 0),
  new THREE.Vector3(0, 1, 0)
);
createLabelAndLine(
  "Bottom (Yellow)",
  0xffff00,
  new THREE.Vector3(0, -2, 0),
  new THREE.Vector3(0, -1, 0)
);
createLabelAndLine(
  "Right (Red)",
  0xff0000,
  new THREE.Vector3(2, 0, 0),
  new THREE.Vector3(1, 0, 0)
);
createLabelAndLine(
  "Left (Green)",
  0x00ff00,
  new THREE.Vector3(-2, 0, 0),
  new THREE.Vector3(-1, 0, 0)
);

// Function to update line positions
function updateLinePositions() {
  lines.forEach((line, index) => {
    const labelPosition = labels[index].position;
    line.geometry.attributes.position.array[3] = labelPosition.x;
    line.geometry.attributes.position.array[4] = labelPosition.y;
    line.geometry.attributes.position.array[5] = labelPosition.z;
    line.geometry.attributes.position.needsUpdate = true;
  });
}

const controls = new OrbitControls(camera, renderer.domElement);
// Function to animate the cube and labels
const animate = () => {
  requestAnimationFrame(animate);

  // Rotate the cube
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  updateLinePositions();

  // Render the scene
  renderer.render(scene, camera);
};

animate();
