# 5/6/2022
# https://figurl.org/f?v=gs://figurl/volumeview-4&d=ipfs://bafkreig3jprc63qh25zv6si6cjh6a35tl72hp6ipwxdou3mvqrgvt3wbhu&label=Test%20grid%20vector%20field

import os
import numpy as np
import volumeview as vv

def main():
    Nx = 90; Ny = 60; Nz = 45
    ix, iy, iz = np.meshgrid(*[np.linspace(-1, 1, n) for n in [Nx, Ny, Nz]], indexing='ij')
    a = np.zeros((3, Nx, Ny, Nz), dtype=np.float32)
    a[0, :, :, :] = np.sin((ix + iy - iz) * 4 * np.pi) * np.exp(-3 * (ix**2 + iy**2 + iz**2))
    a[1, :, :, :] = np.sin((iy + iz - ix) * 4 * np.pi) * np.exp(-3 * (ix**2 + iy**2 + iz**2))
    a[2, :, :, :] = np.sin((ix + iz - iy) * 4 * np.pi) * np.exp(-3 * (ix**2 + iy**2 + iz**2))

    W = vv.Workspace()
    grid = W.add_grid(name='main', Nx=Nx, Ny=Ny, Nz=Nz, x0=0, y0=0, z0=0, dx=1, dy=1, dz=1)
    W.add_grid_vector_field(name='vector_field_1', grid=grid, data=a.astype(np.float32))

    F = W.create_figure()
    url = F.url(label='Test grid vector field')
    print(url)


if __name__ == '__main__':
    main()