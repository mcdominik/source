import curses
from gpiozero import Motor, PWMOutputDevice


class Vehicle:
    def __init__(self):
        self.left_motor = Motor(forward=17, backward=22)
        self.left_pwm = PWMOutputDevice(18)
        self.left_pwm.value = 0

    def forward(self):
        self.left_motor.forward()
        self.left_pwm.value = 0.5

    def backward(self):
        self.left_motor.backward()
        self.left_pwm.value = 0.5

    def map_key_to_command(self, key):
        map = {
            curses.KEY_UP: self.forward,
            curses.KEY_DOWN: self.backward
        }
        return map[key]

    def control(self, key):
        return self.map_key_to_command(key)


rpi_vehicle = Vehicle()


def main(window):
    next_key = None

    while True:
        curses.halfdelay(1)
        if next_key is None:
            key = window.getch()
            print(key)
        else:
            key = next_key
            next_key = None
        if key != -1:
            # KEY PRESSED
            curses.halfdelay(1)
            action = rpi_vehicle.control(key)
            if action:
                action()
            next_key = key
            while next_key == key:
                next_key = window.getch()
            # KEY RELEASED
            rpi_vehicle.left_motor.stop()


curses.wrapper(main)
