#include <stdio.h>
#include <emscripten.h>

#include "core_main.h"

#define SCREEN_WIDTH 131
#define SCREEN_HEIGHT 16
#define BLACK

uint8_t screen[SCREEN_WIDTH * SCREEN_HEIGHT * 4];

void init_screen() {
  for (int y=0; y<SCREEN_HEIGHT; y++) {
    for (int x=0; x<SCREEN_WIDTH; x++) {
      int i = (y * SCREEN_HEIGHT + x) * 4;
      screen[i + 0] = 255;  // Red
      screen[i + 1] = 255;  // Green
      screen[i + 2] = 255;  // Blue
      screen[i + 3] = 255;  // Alpha
    }
  }
}

int main() {
  printf("Start\n");
  init_screen();
  EM_ASM({
      shellInit($0);
    }, screen);
  core_init(0, 0, 0, 0);
  printf("End\n");
  return 0;
}

void shell_print(const char *text, int length,
                 const char *bits, int bytesperline,
                 int x, int y, int width, int height) {
  
}

void shell_beeper(int frequency, int duration) {}

void shell_blitter(const char *bits, int bytesperline, int x, int y,
                   int width, int height) {
  printf("Blitter\n");
  for (int yp = 0; yp < height; yp++) {
    char b = 0;
    for (int xp = 0; xp < width; xp++) {
      if (xp % 8 == 0) {
        b = bits[yp * bytesperline + x];
      }
      int col = b & 1 ? 0 : 255;
      b = b >> 1;
      int outI = ((y + yp) * SCREEN_WIDTH + x + xp) * 4;
      screen[outI + 0] = col;  // Red
      screen[outI + 1] = col;  // Green
      screen[outI + 2] = col;  // Blue
    }
  }

  EM_ASM({
      updateScreen();
  });
}

void shell_message(const char *message) {
  
}

void shell_powerdown() {
}

int shell_low_battery() {
  return 0;
}

int8 shell_random_seed() {
  return 0;
}

void shell_annunciators(int updn, int shf, int prt, int run, int g, int rad) {
}

uint4 shell_milliseconds() {
  return 0;
}

int shell_decimal_point() {
  return 0;
}

void shell_get_time_date(uint4 *time, uint4 *date, int *weekday) {
  
}
