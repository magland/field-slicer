from setuptools import setup, find_packages

setup(
    packages=find_packages(),
    scripts=[],
    include_package_data = True,
    install_requires=[
        'kachery-client>=1.0.20',
        'figurl>=0.1.4'
    ]
)
