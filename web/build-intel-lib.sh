#!/bin/sh
if [ -f gcc111libbid.a ]; then exit 0; fi

tar xvfz ../inteldecimal/IntelRDFPMathLib20U1.tar.gz
cd IntelRDFPMathLib20U1
patch -p0 <../intel-lib-emcc.patch

cd LIBRARY
emmake make CALL_BY_REF=1 GLOBAL_RND=1 GLOBAL_FLAGS=1 UNCHANGED_BINARY_FLAGS=0
mv libbid.a ../../libbid.a
cd ../..
