import { Vec3 } from 'FourPanelView/FourPanelView';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { DoubleSide } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { WorkspaceGrid, WorkspaceSurface } from 'VolumeViewData';
import { Scene3DOpts } from 'WorkspaceView/workspaceViewSelectionReducer';

type Props = {
    grid?: WorkspaceGrid
    focusPosition?: Vec3
    surfaces: WorkspaceSurface[]
    scene3DOpts: Scene3DOpts
    width: number
    height: number
}

const planeMesh = (p0: [number, number, number], v1: [number, number, number], v2: [number, number, number], normal: [number, number, number], color: string, opts: {transparent: boolean, opacity: number}) => {
    const material = new THREE.MeshPhongMaterial( {
        color,
        flatShading: true,
        side: DoubleSide,
        opacity: opts.opacity,
        transparent: opts.transparent
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

const surfaceMesh = (vertices: number[][], faces: number[][]) => {
    const material = new THREE.MeshBasicMaterial( {
        color: 'white',
        wireframe: true
    })

    const geometry = new THREE.BufferGeometry()

    const indices0: number[] = [] // faces
    const vertices0 = []
    const normals0 = []

    for (let v of vertices) {
        vertices0.push(v[0], v[1], v[2])
        normals0.push(1, 0, 0) // don't know how to do this right now, so passing (1, 0, 0)
    }
    for (let f of faces) {
        indices0.push(f[0], f[1], f[2])
    }
    
    geometry.setIndex( indices0 );
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices0, 3 ) )
    geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals0, 3 ) )
    const obj = new THREE.Mesh( geometry, material )
    return obj
}

const Scene3DPanelView: FunctionComponent<Props> = ({grid, focusPosition, surfaces, scene3DOpts, width, height}) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null)

    const scene = useMemo(() => {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color( 0x000000 );
        return scene
    }, [])

    const objects = useMemo(() => {
        const objects: THREE.Object3D[] = []

        if ((grid) && (focusPosition)) {
            const p0 = [grid.x0, grid.y0, grid.z0]
            const p1 = [grid.x0 + grid.dx * grid.Nx, grid.y0 + grid.dy * grid.Ny, grid.z0 + grid.dz * grid.Nz]
            const focusPoint: [number, number, number] = [grid.x0 + focusPosition[0] * grid.dy, grid.y0 + focusPosition[1] * grid.dy, grid.z0 + focusPosition[2] * grid.dz]

            const opts = {opacity: scene3DOpts.referencePlanesOpacity, transparent: scene3DOpts.transparentReferencePlanes}
            const planeXY = planeMesh([p0[0], p0[1], focusPoint[2]], [p1[0] - p0[0], 0, 0], [0, p1[1] - p0[1], 0], [0, 0, 1], 'rgb(120, 120, 150)', opts)
            const planeXZ = planeMesh([p0[0], focusPoint[1], p0[2]], [p1[0] - p0[0], 0, 0], [0, 0, p1[2] - p0[2]], [0, 1, 0], 'rgb(120, 150, 120)', opts)
            const planeYZ = planeMesh([focusPoint[0], p0[1], p0[2]], [0, p1[1] - p0[1], 0], [0, 0, p1[2] - p0[2]], [1, 0, 0], 'rgb(150, 120, 120)', opts)
            const lineX = lineMesh(focusPoint, [grid.x0 + grid.Nx * grid.dx * 1.3, focusPoint[1], focusPoint[2]], 'red')
            const lineY = lineMesh(focusPoint, [focusPoint[0], grid.y0 + grid.Ny * grid.dy * 1.3, focusPoint[2]], 'green')
            const lineZ = lineMesh(focusPoint, [focusPoint[0], focusPoint[1], grid.z0 + grid.Nz * grid.dz * 1.3], 'blue')

            
            if (scene3DOpts.showReferencePlanes) {
                objects.push(planeXY, planeXZ, planeYZ)
            }
            if (scene3DOpts.showReferenceLines) {
                objects.push(lineX, lineY, lineZ)
            }
        }

        for (let X of surfaces) {
            objects.push(
                surfaceMesh(X.vertices, X.faces)
            )
        }
        return objects
    }, [focusPosition, grid, surfaces, scene3DOpts])

    const bbox = useMemo(() => {
        if (grid) {
            const p0 = [grid.x0, grid.y0, grid.z0]
            const p1 = [grid.x0 + grid.dx * grid.Ny, grid.y0 + grid.dy * grid.Ny, grid.z0 + grid.dz * grid.Nz]
            return new THREE.Box3(new THREE.Vector3(p0[0], p0[1], p0[2]), new THREE.Vector3(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]))
        }
        else {
            return getBoundingBoxForSurfaces(surfaces)
        }
    }, [grid, surfaces])

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
    }, [renderer, camera, container, controls, height, objects, width, scene])

    return (
        <div ref={setContainer} />
    )
}

const getBoundingBoxForSurfaces = (surfaces: WorkspaceSurface[]) => {
    const mins: [number, number, number][] = []
    const maxs: [number, number, number][] = []
    for (let S of surfaces) {
        mins.push([min(S.vertices.map(v => (v[0]))), min(S.vertices.map(v => (v[1]))), min(S.vertices.map(v => (v[2])))])
        maxs.push([max(S.vertices.map(v => (v[0]))), max(S.vertices.map(v => (v[1]))), max(S.vertices.map(v => (v[2])))])
    }
    if (mins.length === 0) {
        return new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1))
    }

    const vmin = [min(mins.map(a => a[0])), min(mins.map(a => a[1])), min(mins.map(a => a[2]))]
    const vmax = [max(maxs.map(a => a[0])), max(maxs.map(a => a[1])), max(maxs.map(a => a[2]))]
    return new THREE.Box3(new THREE.Vector3(vmin[0], vmin[1], vmin[2]), new THREE.Vector3(vmax[0] - vmin[0], vmax[1] - vmin[1], vmax[2] - vmin[2]))
}

const min = (a: number[]) => {
    return a.reduce((prev, current) => (prev < current) ? prev : current, a[0] || 0)
}

const max = (a: number[]) => {
    return a.reduce((prev, current) => (prev > current) ? prev : current, a[0] || 0)
}

export default Scene3DPanelView