import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Coord3 } from './FourPanelVolumeView';
import "./VolumeViewControl.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DoubleSide } from 'three';

type Props = {
    volumeData: number[][][][]
    componentNames: string[]
    componentIndex: number
    setComponentIndex: (c: number) => void
    focusPosition: Coord3
    setFocusPosition: (p: Coord3) => void
    scale: number
    setScale: (s: number) => void
    width: number
    height: number
}

const planeMesh = (p0: [number, number, number], v1: [number, number, number], v2: [number, number, number], normal: [number, number, number], color: string) => {
    const material = new THREE.MeshPhongMaterial( {
        color,
        flatShading: true,
        side: DoubleSide
    })

    const geometry = new THREE.BufferGeometry()

    const indices: number[] = []
    const vertices = []
    const normals = []

    vertices.push(p0[0], p0[1], p0[2])
    normals.push(normal[0], normal[1], normal[2])
    vertices.push(p0[0] + v1[0], p0[1] + v1[1], p0[2] + v1[2])
    normals.push(normal[0], normal[1], normal[2])
    vertices.push(p0[0] + v1[0] + v2[0], p0[1] + v1[1] + v2[1], p0[2] + v1[2] + v2[2])
    normals.push(normal[0], normal[1], normal[2])
    vertices.push(p0[0] + v2[0], p0[1] + v2[1], p0[2] + v2[2])
    normals.push(normal[0], normal[1], normal[2])

    indices.push(0, 1, 2)
    indices.push(0, 2, 3)
    
    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) )
    geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) )
    return new THREE.Mesh( geometry, material )
}

const lineMesh = (p1: [number, number, number], p2: [number, number, number], color: string) => {
    const material = new THREE.LineBasicMaterial({
        color
    });
    
    const points = [
        new THREE.Vector3(p1[0], p1[1], p1[2]),
        new THREE.Vector3(p2[0], p2[1], p2[2])
    ]
    
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    const line = new THREE.Line( geometry, material );
    return line
}

const Volume3DScene: FunctionComponent<Props> = ({volumeData, componentNames, componentIndex, setComponentIndex, focusPosition, setFocusPosition, scale, setScale, width, height}) => {
    const {Nx, Ny, Nz} = useMemo(() => {
        return {Nx: volumeData[0].length, Ny: volumeData[0][0].length, Nz: volumeData[0][0][0].length}
    }, [volumeData])
    
    const [container, setContainer] = useState<HTMLDivElement | null>(null)

    const scene = useMemo(() => {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color( 0x000000 );
        return scene
    }, [])

    const objects = useMemo(() => {
        const planeXY = planeMesh([0, 0, focusPosition[2]], [Nx, 0, 0], [0, Ny, 0], [0, 0, 1], 'rgb(120, 120, 150)')
        const planeXZ = planeMesh([0, focusPosition[1], 0], [Nx, 0, 0], [0, 0, Nz], [0, 1, 0], 'rgb(120, 150, 120)')
        const planeYZ = planeMesh([focusPosition[0], 0, 0], [0, Ny, 0], [0, 0, Nz], [1, 0, 0], 'rgb(150, 120, 120)')
        const lineX = lineMesh(focusPosition, [Nx * 1.3, focusPosition[1], focusPosition[2]], 'red')
        const lineY = lineMesh(focusPosition, [focusPosition[0], Ny * 1.3, focusPosition[2]], 'green')
        const lineZ = lineMesh(focusPosition, [focusPosition[0], focusPosition[1], Nz * 1.3], 'blue')
        return [planeXY, planeXZ, planeYZ, lineX, lineY, lineZ]
    }, [focusPosition, Nx, Ny, Nz])

    const bbox = useMemo(() => {
        return new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(Nx, Ny, Nz))
    }, [Nx, Ny, Nz])

    const {camera, controls} = useMemo(() => {
        if (!container) return {camera: undefined, controls: undefined}
        const p = {x: (bbox.min.x + bbox.max.x) / 2, y: (bbox.min.y + bbox.max.y) / 2, z: (bbox.min.z + bbox.max.z) / 2}
        const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 100000 )
        camera.position.set(p.x, p.y, p.z + (bbox.max.z - bbox.min.z) * 6)
        const controls = new OrbitControls( camera, container )
        controls.target.set(p.x, p.y, p.z)
        return {
            camera,
            controls
        }
    }, [width, height, bbox, container])

    useEffect(() => {
        if (!scene) return
        if (!container) return
        if (!controls) return
        if (!camera) return

        scene.clear()

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );

        while (container.firstChild) container.removeChild(container.firstChild)
        container.appendChild(renderer.domElement)
        
        // var cube = new THREE.Mesh( geometry, material );
        // scene.add( cube );

        // const mesh = new THREE.Mesh( getMeshGeometry(), material );
        // scene.add(mesh)

        for (let obj of objects) {
            scene.add(obj)
        }

        const light = new THREE.HemisphereLight();
		scene.add( light );

        const render = () => {
            renderer.render( scene, camera );
        }
        controls.addEventListener( 'change', render );
        controls.update()
        render()

        // let canceled = false
        // const animate = () => {
        //     if (canceled) return
        //     requestAnimationFrame( animate );
        //     // cube.rotation.x += 0.01;
        //     // cube.rotation.y += 0.01;
            
        // };
        // animate();

        return () => {
            controls.removeEventListener('change', render)
        }
    }, [camera, container, controls, height, objects, width, scene])

    return (
        <div ref={setContainer} />
    )
}

export default Volume3DScene