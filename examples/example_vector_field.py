# On 12/10/21 produced output:
# https://figurl.org/f?v=gs://figurl/volumeview-2&d=48530916122545e6afeaf84645e7e13ea4651791&channel=flatiron1&label=Test%20vector%20field%20view

import os
import numpy as np
import volumeview as vv

def main():
    assert os.getenv('FIGURL_CHANNEL'), 'Environment variable not set: FIGURL_CHANNEL'

    a = np.zeros((3, 90, 60, 45), dtype=np.float32)
    ix, iy, iz = np.meshgrid(*[np.linspace(-1, 1, n) for n in a.shape[1:]], indexing='ij')
    a[0, :, :, :] = np.sin((ix + iy - iz) * 4 * np.pi) * np.exp(-3 * (ix**2 + iy**2 + iz**2))
    a[1, :, :, :] = np.sin((iy + iz - ix) * 4 * np.pi) * np.exp(-3 * (ix**2 + iy**2 + iz**2))
    a[2, :, :, :] = np.sin((ix + iz - iy) * 4 * np.pi) * np.exp(-3 * (ix**2 + iy**2 + iz**2))

    F = vv.create_vector_field_view(a)
    url = F.url(label='Test vector field view')
    print(url)


if __name__ == '__main__':
    main()