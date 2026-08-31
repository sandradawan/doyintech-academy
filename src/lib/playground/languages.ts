export type PlaygroundLanguage = {
  id: string;
  label: string;
  runtime: "browser" | "piston";
  /** Monaco Editor language id */
  monaco: string;
  pistonLanguage?: string;
  pistonVersion?: string;
  defaultCode: string;
};

export const PLAYGROUND_LANGUAGES: PlaygroundLanguage[] = [
  {
    id: "html",
    monaco: "html",
    label: "HTML / CSS / JS",
    runtime: "browser",
    defaultCode: `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body {\n      font-family: system-ui, sans-serif;\n      display: grid;\n      place-items: center;\n      min-height: 100vh;\n      margin: 0;\n      background: #0b0e14;\n      color: #f1f5f9;\n    }\n    button {\n      background: #3b82f6;\n      color: white;\n      border: 0;\n      padding: 0.75rem 1.25rem;\n      border-radius: 0.5rem;\n      font-weight: 600;\n      cursor: pointer;\n    }\n  </style>\n</head>\n<body>\n  <div>\n    <h1>Hello from Doyintech</h1>\n    <button onclick="greet()">Click me</button>\n    <p id="out"></p>\n  </div>\n  <script>\n    function greet() {\n      document.getElementById("out").textContent = "You ran code in the playground!";\n    }\n  </script>\n</body>\n</html>`,
  },
  {
    id: "javascript",
    monaco: "javascript",
    label: "JavaScript",
    runtime: "piston",
    pistonLanguage: "javascript",
    pistonVersion: "18.15.0",
    defaultCode: `function sum(a, b) {\n  return a + b;\n}\n\nconsole.log("2 + 3 =", sum(2, 3));\nconsole.log("Hello, Doyintech Academy!");`,
  },
  {
    id: "python",
    monaco: "python",
    label: "Python",
    runtime: "piston",
    pistonLanguage: "python",
    pistonVersion: "3.10.0",
    defaultCode: `def greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nprint(greet("Doyintech"))\nprint("Squares:", [n * n for n in range(1, 6)])`,
  },
  {
    id: "typescript",
    monaco: "typescript",
    label: "TypeScript",
    runtime: "piston",
    pistonLanguage: "typescript",
    pistonVersion: "5.0.3",
    defaultCode: `function add(a: number, b: number): number {\n  return a + b;\n}\n\nconsole.log("Sum:", add(10, 32));`,
  },
  {
    id: "java",
    monaco: "java",
    label: "Java",
    runtime: "piston",
    pistonLanguage: "java",
    pistonVersion: "15.0.2",
    defaultCode: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java!");\n    int total = 0;\n    for (int i = 1; i <= 5; i++) total += i;\n    System.out.println("Sum 1..5 = " + total);\n  }\n}`,
  },
  {
    id: "c",
    monaco: "c",
    label: "C",
    runtime: "piston",
    pistonLanguage: "c",
    pistonVersion: "10.2.0",
    defaultCode: `#include <stdio.h>\n\nint main() {\n  printf("Hello from C!\\n");\n  int sum = 0;\n  for (int i = 1; i <= 5; i++) sum += i;\n  printf("Sum 1..5 = %d\\n", sum);\n  return 0;\n}`,
  },
  {
    id: "cpp",
    monaco: "cpp",
    label: "C++",
    runtime: "piston",
    pistonLanguage: "c++",
    pistonVersion: "10.2.0",
    defaultCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello from C++!" << endl;\n  int sum = 0;\n  for (int i = 1; i <= 5; i++) sum += i;\n  cout << "Sum 1..5 = " << sum << endl;\n  return 0;\n}`,
  },
  {
    id: "go",
    monaco: "go",
    label: "Go",
    runtime: "piston",
    pistonLanguage: "go",
    pistonVersion: "1.16.2",
    defaultCode: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello from Go!")\n  sum := 0\n  for i := 1; i <= 5; i++ {\n    sum += i\n  }\n  fmt.Println("Sum 1..5 =", sum)\n}`,
  },
  {
    id: "php",
    monaco: "php",
    label: "PHP",
    runtime: "piston",
    pistonLanguage: "php",
    pistonVersion: "8.2.3",
    defaultCode: `<?php\necho "Hello from PHP!\\n";\n$sum = 0;\nfor ($i = 1; $i <= 5; $i++) {\n  $sum += $i;\n}\necho "Sum 1..5 = $sum\\n";`,
  },
  {
    id: "ruby",
    monaco: "ruby",
    label: "Ruby",
    runtime: "piston",
    pistonLanguage: "ruby",
    pistonVersion: "3.0.1",
    defaultCode: `puts "Hello from Ruby!"\nsum = (1..5).sum\nputs "Sum 1..5 = #{sum}"`,
  },
  {
    id: "rust",
    monaco: "rust",
    label: "Rust",
    runtime: "piston",
    pistonLanguage: "rust",
    pistonVersion: "1.68.2",
    defaultCode: `fn main() {\n    println!("Hello from Rust!");\n    let sum: i32 = (1..=5).sum();\n    println!("Sum 1..5 = {}", sum);\n}`,
  },
  {
    id: "csharp",
    monaco: "csharp",
    label: "C#",
    runtime: "piston",
    pistonLanguage: "csharp",
    pistonVersion: "6.12.0",
    defaultCode: `using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello from C#!");\n    int sum = 0;\n    for (int i = 1; i <= 5; i++) sum += i;\n    Console.WriteLine($"Sum 1..5 = {sum}");\n  }\n}`,
  },
];

export function getPlaygroundLanguage(id: string) {
  return PLAYGROUND_LANGUAGES.find((l) => l.id === id) ?? PLAYGROUND_LANGUAGES[0];
}
