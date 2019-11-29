#include <stdio.h>
#include <emscripten.h>

#include "core_main.h"


#define SCREEN_WIDTH 131
#define SCREEN_HEIGHT 16

uint8_t screen[SCREEN_WIDTH * SCREEN_HEIGHT * 4];

uint8_t offRed = 0;
uint8_t offGreen = 0;
uint8_t offBlue = 0;
uint8_t onRed = 255;
uint8_t onGreen = 255;
uint8_t onBlue = 255;

int main() {
  printf("Start\n");
  EM_ASM({
      shellInit($0);
    }, screen);
  core_init(0, 0, 0, 0);
  printf("End\n");
  return 0;
}

extern "C" {
void EMSCRIPTEN_KEEPALIVE set_colors(uint8_t newOffRed,
                                     uint8_t newOffGreen,
                                     uint8_t newOffBlue,
                                     uint8_t newOnRed,
                                     uint8_t newOnGreen,
                                     uint8_t newOnBlue) {
  offRed = newOffRed;
  offGreen = newOffGreen;
  offBlue = newOffBlue;
  onRed = newOnRed;
  onGreen = newOnGreen;
  onBlue = newOnBlue;
  core_repaint_display();
}
}

void shell_print(const char *text, int length,
                 const char *bits, int bytesperline,
                 int x, int y, int width, int height) {
  
}

void shell_beeper(int frequency, int duration) {}

void shell_blitter(const char *bits, int bytesperline, int x, int y,
                   int width, int height) {
  for (int yp = 0; yp < height; yp++) {
    char b = 0;
    for (int xp = 0; xp < width; xp++) {
      if (xp % 8 == 0) {
        b = bits[yp * bytesperline + xp / 8];
      }
      int on = b & 1;
      b = b >> 1;
      int outI = ((y + yp) * SCREEN_WIDTH + x + xp) * 4;
      screen[outI + 0] = on ? onRed : offRed;  // Red
      screen[outI + 1] = on ? onGreen : offGreen;  // Green
      screen[outI + 2] = on ? onBlue : offBlue;  // Blue
      screen[outI + 3] = 255;  // Alpha
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
