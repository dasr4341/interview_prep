# React Starter Template

## Features
- React typescript with eslint and husky pre-commit hooks for checking lint staged files 
- Tailwind added 
- Auth pages added 
- Redux with saga configured 
- Basic Folder structure 
- React router dom with few routes configured 
- Cypress E2E with typescript config ready 
- Vscode workspace settings added 
- Vscode recommended extensions config added 
- Prettier config added

## Code Quality must be maintained
- Code quality 
  - Hooks Ordering 
  - import ordering 
  - Indentation ( 2 space )
  - END of the line add a blank line 
  - Whitespace 
  - Class name Hyphen-case
  - Component Main function PascalCase 
  - Component Child function camelCase
  - Variable Name, Css Class Name, Component class Name should be meaningful.
  - Eslint 
  - Max 300 lines of code for each components code blocks 

## Recommend Folder structure    
  - Global Components
    - component name ( DIR )
      - style
      - test spec 
  - Page 
    - Auth 
    - Admin 
    - Orders
      - Order List popover 
    - Users 
    
  - SCSS
    - components
  - lib 
    - Guards 
    - Interface
    - Hooks ( Custom )
    - Api Clients
    - Redux Store 
    - Error handler
    - App Constant
