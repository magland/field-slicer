import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { DoubleSide } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type Props = {
    vertices: number[][]
    faces: number[]
    ifaces: number[]
    width: number
    height: number
}

const SurfaceWidget: FunctionComponent<Props> = ({width, height, vertices, faces, ifaces}) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null)
    const scene = useMemo(() => {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color( 0x000000 );
        return scene
    }, [])
    const bbox = useMemo(() => {
        const xmin = min(vertices.map(v => (v[0])))
        const xmax = max(vertices.map(v => (v[0])))
        const ymin = min(vertices.map(v => (v[1])))
        const ymax = max(vertices.map(v => (v[1])))
        const zmin = min(vertices.map(v => (v[2])))
        const zmax = max(vertices.map(v => (v[2])))

        return new THREE.Box3(new THREE.Vector3(xmin, ymin, zmin), new THREE.Vector3(xmax, ymax, zmax))
    }, [vertices])
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
    const renderer = useMemo(() => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );
        return renderer
    }, [width, height])
    const objects = useMemo(() => {
        const material = new THREE.MeshPhongMaterial( {
            color: 'green',
            flatShading: true,
            side: DoubleSide
        })
    
        const geometry = new THREE.BufferGeometry()
    
        const indices0: number[] = []
        const vertices0 = []
        const normals0 = []
    
        for (let v of vertices) {
            vertices0.push(v[0], v[1], v[2])
            normals0.push(1, 0, 0)
        }
        for (let iface of ifaces) {
            indices0.push(faces[iface], faces[iface + 1], faces[iface + 2])
        }
        
        geometry.setIndex( indices0 );
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices0, 3 ) )
        geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals0, 3 ) )
        const obj = new THREE.Mesh( geometry, material )
        return [obj]
    }, [vertices, faces, ifaces])
    useEffect(() => {
        if (!scene) return
        if (!container) return
        if (!controls) return
        if (!camera) return

        scene.clear()

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

        return () => {
            controls.removeEventListener('change', render)
        }
    }, [renderer, camera, container, controls, scene])
    return (
        <div ref={setContainer} />
    )
}

const min = (a: number[]) => {
    return a.reduce((prev, current) => (prev < current) ? prev : current, a[0] || 0)
}

const max = (a: number[]) => {
    return a.reduce((prev, current) => (prev > current) ? prev : current, a[0] || 0)
}

export default SurfaceWidget