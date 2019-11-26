.PHONY: clean

CFLAGS = -MMD \
	 -Wall \
	 -Wno-parentheses \
	 -Wno-write-strings \
	 -Wno-sign-compare \
	 -Wno-narrowing \
	 -Wno-constant-conversion \
	 -Wno-sometimes-uninitialized \
	 -Wno-format-truncation \
	 -Wno-unknown-warning-option \
	 -g \
	 -DVERSION="\"$(shell cat VERSION)\"" \
	 -DVERSION_PLATFORM="\"$(shell uname -s)\"" \
	 -DDECIMAL_CALL_BY_REFERENCE=1 \
	 -DDECIMAL_GLOBAL_ROUNDING=1 \
	 -DDECIMAL_GLOBAL_ROUNDING_ACCESS_FUNCTIONS=1 \
	 -DDECIMAL_GLOBAL_EXCEPTION_FLAGS=1 \
	 -DDECIMAL_GLOBAL_EXCEPTION_FLAGS_ACCESS_FUNCTIONS=1

CXXFLAGS = $(CFLAGS) \
	 -fno-exceptions \
	 -fno-rtti \
	 -D_WCHAR_T_DEFINED

LIBS = libbid.a

SRCS = shell_main.cc \
	shell_spool.cc core_main.cc core_commands1.cc core_commands2.cc \
	core_commands3.cc core_commands4.cc core_commands5.cc \
	core_commands6.cc core_commands7.cc core_display.cc core_globals.cc \
	core_helpers.cc core_keydown.cc core_linalg1.cc core_linalg2.cc \
	core_math1.cc core_math2.cc core_phloat.cc core_sto_rcl.cc \
	core_tables.cc core_variables.cc
OBJS = shell_main.bc core_main.bc core_commands1.bc core_commands2.bc \
	core_commands3.bc core_commands4.bc core_commands5.bc \
	core_commands6.bc core_commands7.bc core_display.bc core_globals.bc \
	core_helpers.bc core_keydown.bc core_linalg1.bc core_linalg2.bc \
	core_math1.bc core_math2.bc core_phloat.bc core_sto_rcl.bc \
	core_tables.bc core_variables.bc
JS_SRCS = shell_main.js

CXXFLAGS += -DBCD_MATH
EXE = free42.js

$(EXE): $(OBJS) $(JS_SRCS)
	emcc -o $(EXE) $(LDFLAGS) $(OBJS) $(LIBS) --pre-js $(JS_SRCS)

$(SRCS) skin2cc.cc keymap2cc.cc skin2cc.conf: symlinks

%.bc: %.cc
	emcc $(CXXFLAGS) -c -o $@ $<

symlinks:
	for fn in `cd ../common; /bin/ls`; do ln -s ../common/$$fn; done
	sh ./build-intel-lib.sh
	touch symlinks

clean:
	rm -f `find . -type l`
	rm -f *.o *.bc *.d *.i *.ii *.s symlinks core.*
	rm -rf IntelRDFPMathLib20U1

