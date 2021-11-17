import os
import numpy as np
import field_slicer as fs

def main():
    assert os.getenv('FIGURL_CHANNEL'), 'Environment variable not set: FIGURL_CHANNEL'

    a = np.zeros((3, 90, 60, 45), dtype=np.float32)
    ix, iy, iz = np.meshgrid(*[np.linspace(0, 1, n) for n in a.shape[1:]], indexing='ij')
    a[0, :, :, :] = np.sin((ix + iy - iz) * 2 * np.pi)
    a[1, :, :, :] = np.sin((iy + iz - ix) * 2 * np.pi)
    a[2, :, :, :] = np.sin((ix + iz - iy) * 2 * np.pi)

    F = fs.view_volume(a, channel_names=['channel 1', 'channel 2', 'channel 3'])
    url = F.url(label='Test field slicer')
    print(url)


if __name__ == '__main__':
    main()