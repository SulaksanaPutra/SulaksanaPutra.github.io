<template>
  <div class="text-justify hyphens-auto leading-relaxed">
    <section class="content-narrow pt-8 pb-4" id="context">
      <p>
        Hi, I’m Bayu. I work on systems behind everyday operations—orders, finance, payments,
        warehouse and fleet operations, internal platforms, and multi-tenant business tools.
      </p>
      <p>
        Over six years, I’ve built and maintained production systems under real daily usage. For the last four
        years, I’ve worked remotely, owning features from design through production, running systems under real
        traffic, and serving as technical lead on specific projects.
      </p>
      <p>
        I design systems that adapt as requirements evolve, where traffic grows unevenly and failures are subtle
        but costly, requiring deliberate trade-offs between speed, cost, and correctness.
      </p>
    </section>

    <section class="content-narrow py-8" id="principles">
      <p class="label-overline mb-4">How I think about engineering</p>
      <ul class="list-none p-0 m-0">
        <li class="mb-8 pb-8 border-b border-border-subtle last:border-0 last:mb-0 last:pb-0">
          <strong>Reliability</strong><br>
          Reliable systems are built on strong patterns and clear principles. When the team follows them,
          failures are predictable, diagnosable, and easier to resolve.
        </li>
        <li class="mb-8 pb-8 border-b border-border-subtle last:border-0 last:mb-0 last:pb-0">
          <strong>Vision & Cost Awareness</strong><br>
          Every project has trade-offs. Early decisions about the app’s purpose, vision, and cost shape
          maintainability, scalability, and long-term success.
        </li>
        <li class="mb-8 pb-8 border-b border-border-subtle last:border-0 last:mb-0 last:pb-0">
          <strong>Simplicity</strong><br>
          Complexity incurs a cost. My system designs prioritize simplicity, ease of use, and the ability to scale to accommodate future needs and the overall vision.
        </li>
        <li class="mb-8 pb-8 border-b border-border-subtle last:border-0 last:mb-0 last:pb-0">
          <strong>Clean boundaries</strong><br>
          A clear assignment of responsibilities makes it easy to identify and fix problems quickly and ensures
          accountability across teams and tasks.
        </li>
      </ul>
    </section>

    <section class="content-narrow mt-9 pt-9 border-t border-border-subtle" id="orientation">
      <p><router-link to="/systems">→ Systems I’ve worked on</router-link></p>
      <p><router-link to="/case-studies">→ Selected case studies</router-link></p>
    </section>
  </div>
</template>

<script setup lang="ts">
// Home view
</script>
