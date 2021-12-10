# On 12/10/21 produced output:
# https://figurl.org/f?v=gs://figurl/volumeview-2&d=8e2d19eaa838930bc9e25dbc09afb7c6d719ede4&channel=flatiron1&label=Test%20volume%20view

import os
import numpy as np
import volumeview as vv

def main():
    assert os.getenv('FIGURL_CHANNEL'), 'Environment variable not set: FIGURL_CHANNEL'

    a = np.zeros((2, 90, 60, 45), dtype=np.float32)
    ix, iy, iz = np.meshgrid(*[np.linspace(-1, 1, n) for n in a.shape[1:]], indexing='ij')
    a[0, :, :, :] = np.exp(-3 * (ix**2 + iy**2 + iz**2))
    a[1, :, :, :] = np.ones(ix.shape) - 0.5 * (np.abs(ix) < 0.8) * (np.abs(iy) < 0.8) * (np.abs(iz) < 0.8)

    F = vv.create_volume_view(a, component_names=['component 1', 'component 2'])
    url = F.url(label='Test volume view')
    print(url)


if __name__ == '__main__':
    main()