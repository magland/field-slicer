# On 12/16/21 produced output:
# https://figurl.org/f?v=gs://figurl/volumeview-2&d=e9d66edac2246a9db4aca6c515d4b79aaa450796&channel=flatiron1&label=Test%20volumeview%20workspace

import os
import numpy as np
import volumeview as vv

def main():
    assert os.getenv('FIGURL_CHANNEL'), 'Environment variable not set: FIGURL_CHANNEL'

    W = vv.Workspace()

    Nx, Ny, Nz = 90, 60, 45
    x0, y0, z0 = -90, -60, -45
    dx, dy, dz = 2, 2, 2

    grid = W.add_grid(name='main', Nx=Nx, Ny=Ny, Nz=Nz, x0=x0, y0=y0, z0=z0, dx=dx, dy=dy, dz=dz)
    
    ix, iy, iz = np.meshgrid(*[np.linspace(-1, 1, n) for n in [Nx, Ny, Nz]], indexing='ij')
    A = (np.exp(-3 * (ix**2 + iy**2 + iz**2))).astype(np.float32)
    B = (np.ones(ix.shape) - 0.5 * (np.abs(ix) < 0.8) * (np.abs(iy) < 0.8) * (np.abs(iz) < 0.8)).astype(np.float32)

    W.add_grid_scalar_field(name='A', grid=grid, data=A)
    W.add_grid_scalar_field(name='B', grid=grid, data=B)

    V = np.zeros((3, Nx, Ny, Nz), dtype=np.float32)
    V[0, :, :, :] = np.sin((ix + iy - iz) * 4 * np.pi) * np.exp(-3 * (ix**2 + iy**2 + iz**2))
    V[1, :, :, :] = np.sin((iy + iz - ix) * 4 * np.pi) * np.exp(-3 * (ix**2 + iy**2 + iz**2))
    V[2, :, :, :] = np.sin((ix + iz - iy) * 4 * np.pi) * np.exp(-3 * (ix**2 + iy**2 + iz**2))
    
    W.add_grid_vector_field(name='field1', grid=grid, data=V)

    a = 30
    vertices = np.array([[-a, -a, -a], [-a, -a, a], [-a, a, -a], [-a, a, a], [a, -a, -a], [a, -a, a], [a, a, -a], [a, a, a]]).astype(np.float32)
    faces = np.array([
        [0, 1, 3], [0, 3, 2], [4, 5, 7], [4, 7, 6], # [-a, *, *] [a, *, *]
        [0, 1, 5], [0, 5, 4], [2, 3, 7], [2, 7, 6], # [*, -a, *] [*, a, *]
        [0, 2, 6], [0, 6, 4], [1, 3, 7], [1, 7, 5]  # [*, *, -a] [*, *, a]
    ]).astype(np.int32)
    surface = W.add_surface(name='surface1', vertices=vertices, faces=faces)

    b = np.array([[1, 1, 1, 1, 1, 1, 1, 1], [0, 1, 0, 1, 0, 1, 0, 1], [0, 0, 1, 1, 2, 2, 3, 3]]).astype(np.float32)
    W.add_surface_vector_field(name='f1', surface=surface, data=b)

    F = W.create_figure()

    url = F.url(label='Test volumeview workspace')
    print(url)


if __name__ == '__main__':
    main()