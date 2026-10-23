# Public Assets Directory

In Next.js, static files placed in the `public` directory can be referenced directly from the root URL.

### Usage
- Files saved in `public/images/example.jpg` can be referenced in code as:
  ```html
  <Image src="/images/example.jpg" alt="Example" width={500} height={300} />
  ```
  or in CSS / background styles as:
  ```css
  background-image: url('/images/example.jpg');
  ```
