Name: Anusha Rao, PID: A17377541
1. Within a Github action that runs whenever code is pushed. This will ensure that any code pushed is automatically tested before it is merged into the main branch. catching bugs early and ensuring high code quality. It also enables a continuous integration workflow, which is essential in team projects or when maintaining high-quality code over time. Manually running tests or running them after development is completed introduces risk by relying on developers' memory and can delay the discovery of bugs until much later in the process.
2. No, because End2End tests are for the entire application pipeline rather than testing individual functions.
3. Navigation mode runs a full audit of the page as it loads from a fresh start (simulates a real user visiting the site), evaluates metrics like performance, accessibility, best practices, SEO, and PWA, and is useful for measuring overall performance and load speed. Snapshot mode captures a single static snapshot of the page in its current state (without loading). It does not measure performance, interactivity, or loading behavior, and is mainly used for checking accessibility and static content.
4. 1) Missing <meta name="viewport"> Tag -> breaks responsive design and can severely harm mobile performance and accessibility. 
   2) 5 resources are not cached efficiently -> Affects repeat visit performance and increases load times.
   3) Avoid Chaining Critical Requests -> Slows LCP because some content depends on resources that load slowly in sequence.



