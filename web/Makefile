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

LIBS = 

SRCS = shell_main.cc shell_skin.cc skins.cc keymap.cc shell_loadimage.cc \
	shell_spool.cc core_main.cc core_commands1.cc core_commands2.cc \
	core_commands3.cc core_commands4.cc core_commands5.cc \
	core_commands6.cc core_commands7.cc core_display.cc core_globals.cc \
	core_helpers.cc core_keydown.cc core_linalg1.cc core_linalg2.cc \
	core_math1.cc core_math2.cc core_phloat.cc core_sto_rcl.cc \
	core_tables.cc core_variables.cc
OBJS = shell_main.o shell_skin.o skins.o keymap.o shell_loadimage.o \
	shell_spool.o core_main.o core_commands1.o core_commands2.o \
	core_commands3.o core_commands4.o core_commands5.o \
	core_commands6.o core_commands7.o core_display.o core_globals.o \
	core_helpers.o core_keydown.o core_linalg1.o core_linalg2.o \
	core_math1.o core_math2.o core_phloat.o core_sto_rcl.o \
	core_tables.o core_variables.o

CXXFLAGS += -DBCD_MATH
EXE = free42.js

$(EXE): $(OBJS)
	$(CXX) -o $(EXE) $(LDFLAGS) $(OBJS) $(LIBS)

$(SRCS) skin2cc.cc keymap2cc.cc skin2cc.conf: symlinks

.cc.o:
	$(CXX) $(CXXFLAGS) -c -o $@ $<

readtest.o: readtest.c
	$(CC) $(CFLAGS) -I IntelRDFPMathLib20U1/TESTS -D__intptr_t_defined -DLINUX -c -o $@ $<

skin2cc: skin2cc.cc
	$(CXX) -o skin2cc skin2cc.cc

skins.cc: skin2cc skin2cc.conf
	./skin2cc

keymap2cc: keymap2cc.cc
	$(CXX) -o keymap2cc keymap2cc.cc

keymap.cc: keymap2cc keymap.txt
	./keymap2cc

symlinks:
	for fn in `cd ../common; /bin/ls`; do ln -s ../common/$$fn; done
	sh ./build-intel-lib.sh
	touch symlinks

clean: FORCE
	rm -f *.o *.d *.i *.ii *.s symlinks core.*
	rm -rf IntelRDFPMathLib20U1

FORCE:
