# demo.py


class Dog:
    def __init__(self, name, breed, color, gender, legs):
        self.name = name
        self.breed = breed
        self.color = color
        self.gender = gender
        self.legs = legs
        self.state = "sitting"


bruce = Dog("Bruce", "English Springer Spaniel", "brown", "male", 4)

print(bruce.name)
