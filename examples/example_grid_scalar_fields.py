# 5/6/2022:
# https://figurl.org/f?v=gs://figurl/volumeview-3&d=ipfs://bafkreiem7y6bactndiabma2c2nb2rtxyw5sv4xsbixgqn74pnmehxccwve&label=Test%20grid%20scalar%20fields

import os
import numpy as np
import volumeview as vv

def main():
    Nx = 90; Ny = 60; Nz = 45
    ix, iy, iz = np.meshgrid(*[np.linspace(-1, 1, n) for n in [Nx, Ny, Nz]], indexing='ij')
    S1 = np.exp(-3 * (ix**2 + iy**2 + iz**2))
    S2 = np.ones(ix.shape) - 0.5 * (np.abs(ix) < 0.8) * (np.abs(iy) < 0.8) * (np.abs(iz) < 0.8)

    W = vv.Workspace()
    grid = W.add_grid(name='main', Nx=Nx, Ny=Ny, Nz=Nz, x0=0, y0=0, z0=0, dx=1, dy=1, dz=1)
    W.add_grid_scalar_field(name='scalar1', grid=grid, data=S1.astype(np.float32))
    W.add_grid_scalar_field(name='scalar2', grid=grid, data=S2.astype(np.float32))

    F = W.create_figure()
    url = F.url(label='Test grid scalar fields')
    print(url)


if __name__ == '__main__':
    main()