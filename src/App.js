import './App.css';
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {useEffect, useMemo, useRef} from "react";
import { Physics, useBox, usePlane } from '@react-three/cannon'
import * as THREE from "three";

function Stars() {
    let group = useRef();
    let theta = 0;
    useFrame(() => {
        if (group.current) {
            // Some things maybe shouldn't be declarative, we're in the render-loop here with full access to the instance
            //const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.01)));
            const s = Math.cos(THREE.Math.degToRad(theta * 2));
            //group.current.rotation.set(r, r, r);
            group.current.scale.set(s, s, s);
        }
    });

    const [geo, mat, coords] = useMemo(() => {
        const geo = new THREE.SphereBufferGeometry(1, 10, 10);
        const mat = new THREE.MeshBasicMaterial({
            color: new THREE.Color("lightpink")
        });
        const coords = new Array(1000)
            .fill()
            .map(i => [
                Math.random() * 800 - 400,
                Math.random() * 800 - 400,
                Math.random() * 800 - 400
            ]);
        return [geo, mat, coords];
    }, []);

    return (
        <group ref={group}>
            {coords.map(([p1, p2, p3], i) => (
                <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]}/>
            ))}
        </group>
    );
}

const CameraController = () => {
    const {camera, gl} = useThree();
    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);
            controls.minDistance = 3;
            controls.maxDistance = 20;
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );
    return null;
};

function Box() {
    const [ref, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }));
    return (
        <mesh  onClick={() => {
            api.velocity.set(0, 2, 0);
        }} ref={ref} position={[0, 2, 0]}>
            <boxBufferGeometry attach="geometry"/>
            <meshLambertMaterial attach="material" color="hotpink"/>
        </mesh>
    );
}

function Plane() {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
    }));
    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
            <planeBufferGeometry attach="geometry" args={[100, 100]} />
            <meshLambertMaterial attach="material" color="lightblue" />
        </mesh>
    );
}

function App() {

    return (
        <div style={{ height: "100vh" }}>
            <Canvas camera={{ position: [5, 5, 5] }} shadowMap="true">
                <color attach="background" args={['black']}/>
                <CameraController/>
                <ambientLight intensity={0.5}/>
                <spotLight position={[10, 15, 10]} angle={0.3}/>
                <Stars/>
                <Physics>
                    <Box/>
                    <Plane/>
                </Physics>
            </Canvas>
        </div>
    );
}

export default App;
