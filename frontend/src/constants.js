/** Supported languages for the online compiler (Judge0 CE). */
export const SUPPORTED_LANGUAGES = ["javascript", "python", "java", "c", "cpp"];

/** Human-readable runtime labels shown in the language selector. */
export const LANGUAGE_LABELS = {
  javascript: "Node.js",
  python: "Python 3",
  java: "OpenJDK",
  c: "GCC (C)",
  cpp: "G++ (C++)",
};

export const CODE_SNIPPETS = {
  javascript: `function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("World");`,
  python: `def greet(name):
    print("Hello, " + name + "!")

greet("World")`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
};
