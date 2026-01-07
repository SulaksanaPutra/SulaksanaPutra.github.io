<template>
  <div class="text-justify hyphens-auto leading-relaxed">
    <section class="content-narrow pt-8">
      <!-- LAAS -->
      <article
          id="system-laas"
          class="mb-16 pb-8 border-b border-border-subtle last:border-b-0"
      >
        <h2 class="text-xl  text-left text-text-primary mb-2">
          LAAS — Logistics as a Service
        </h2>

        <p class="text-text-secondary mb-4">
          A customer-facing platform exposing logistics capabilities to external clients while
          protecting internal operational systems.
        </p>

        <div class="flex flex-wrap gap-2 mb-6">
        <span class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary">
          Customer-facing
        </span>
          <span class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary">
          B2B
        </span>
          <span class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary">
          B2C
        </span>
        </div>

        <div class="space-y-6">
          <div>
            <p class="label-mono">Design intent</p>
            <p>
              Designed to support a new business model where warehouse capacity and logistics services
              could be rented to external customers. Acts as a controlled access layer that exposes
              logistics operations without coupling clients to internal systems.
            </p>
          </div>

          <div>
            <p class="label-mono ">Architecture</p>
            <p>
              Implemented as an asynchronous proxy using queues and background jobs. Requests follow a
              fire-and-forget model, requiring strong observability, logging, and traceability to
              compensate for the lack of immediate synchronous feedback.
            </p>
          </div>

          <div>
            <p class="label-mono ">My role</p>
            <p>
              Sole designer and technical decision-maker. Led development with support from two other
              developers, selecting architecture, patterns, and trade-offs based on lessons learned
              from earlier systems.
            </p>
          </div>

          <div>
            <p class="label-mono ">Trade-offs</p>
            <p>
              Chose Laravel to meet tight delivery timelines, accepting performance and strictness
              limitations compared to Go. Mitigated these through explicit service layers, DTO usage,
              and strict separation between validation, data access, and business logic.
            </p>
          </div>

          <div>
            <p class="label-mono ">Outcome</p>
            <p>
              Enabled a new logistics business model by giving customers real-time access to logistics
              capabilities while shielding internal systems from direct external interaction.
            </p>
          </div>

          <p>
            <router-link to="/case-studies#laas">
              → View case study
            </router-link>
          </p>
        </div>
      </article>

      <!-- Twin v2 WMS -->
      <article
          id="system-twin-v2-wms"
          class="mb-16 pb-8 border-b border-border-subtle last:border-b-0"
      >
        <h2 class="text-xl text-left text-text-primary mb-2">
          Twin <span class="text-base font-bold">V2</span> — Warehouse Management System
        </h2>

        <p class="text-text-secondary mb-4">
          A standalone warehouse management system designed to replace legacy stock handling while
          serving as a foundation for a future SaaS offering.
        </p>

        <div class="flex flex-wrap gap-2 mb-6">
        <span class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary">
          Warehouse Management
        </span>
          <span class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary">
          Distribution
        </span>
          <span class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary">
          Logistics
        </span>
        </div>

        <div class="space-y-6">
          <div>
            <p class="label-mono ">Architecture & design</p>
            <p>
              Backend implemented as independent services with separate databases, written in Go to
              prioritize performance, reliability, and infrastructure cost efficiency. The frontend
              was shared across applications to reduce operational overhead. Design decisions balanced
              SaaS generality against customer-specific requirements inherited from the legacy system.
            </p>
          </div>

          <div>
            <p class="label-mono ">Trade-offs</p>
            <p>
              Chose Go despite a slower development pace to improve correctness and long-term
              operability. Accepted limited modularity in certain workflows due to tight coupling with
              legacy sales systems, deferring full SaaS generalization to later phases.
            </p>
          </div>

          <div>
            <p class="label-mono ">My role</p>
            <p>
              Designed and owned the backend architecture, including service boundaries, data
              separation, and integration contracts. Contributed to frontend architectural decisions
              and took primary responsibility for backend stability in production.
            </p>
          </div>

          <div>
            <p class="label-mono ">Outcome</p>
            <p>
              Delivered a more reliable and scalable stock management system with significantly clearer
              architecture than the legacy platform. Enabled horizontal scaling, safer data migration,
              and improved correctness of inventory calculations.
            </p>
          </div>

          <p>
            <router-link to="/case-studies#twin-v2-wms">
              → View case study
            </router-link>
          </p>
        </div>
      </article>

      <!-- Twin v2 Fleet -->
      <article
          id="system-twin-v2-fleet"
          class="mb-16 pb-8 border-b border-border-subtle last:border-b-0"
      >
        <h2 class="text-xl  text-left text-text-primary mb-2">
          Twin <span class="text-base font-bold">V2</span> — Fleet Management System
        </h2>

        <p class="text-text-secondary mb-4">
          A standalone delivery domain created to isolate fleet and settlement workflows after the
          organization split warehouse and delivery into separate business units.
        </p>

        <div class="flex flex-wrap gap-2 mb-6">
        <span class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary">
          Logistics
        </span>
          <span class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary">
          Delivery Operations
        </span>
        </div>

        <div class="space-y-6">
          <div>
            <p class="label-mono ">Key complexity</p>
            <p>
              Although simpler than WMS in flow, the system required high transparency and traceability.
              This led to complex relational models and extensive logging of state changes. A major
              challenge was reconciling inconsistent legacy business rules—such as unit measurements—
              into a stable and general-purpose domain model.
            </p>
          </div>

          <div>
            <p class="label-mono ">Reliability approach</p>
            <p>
              Integration safety was critical. Failures in communication with WMS or Sales systems
              could cascade into financial impact, so consistency checks and saga-style coordination
              were implemented to protect transaction settlement.
            </p>
          </div>

          <div>
            <p class="label-mono ">My role</p>
            <p>
              Designed the system boundaries and core domain model, implemented critical correctness
              safeguards, and owned integration reliability across dependent systems.
            </p>
          </div>

          <div>
            <p class="label-mono ">Outcome</p>
            <p>
              Delivered a reliable delivery execution platform with improved correctness in settlement
              and measurement handling, while maintaining safe integration with upstream and downstream
              systems.
            </p>
          </div>

          <div>
            <p class="label-mono ">What I would change today</p>
            <p>
              Reduce architectural layering to improve development speed and clarity. With more time,
              I would explore automated routing using optimization or machine learning techniques once
              the domain model is sufficiently simplified.
            </p>
          </div>

          <p>
            <router-link to="/case-studies#twin-v2-fms">
              → View case study
            </router-link>
          </p>
        </div>
      </article>

      <!-- Twin v1 -->
      <article
          id="system-twin-v1"
          class="mb-16 pb-8 border-b border-border-subtle last:border-b-0"
      >
        <h2 class="text-xl text-left text-text-primary mb-2">
          Twin — In-house Distributor System
        </h2>

        <p class="text-text-secondary mb-4 text-justify">
          A business-critical legacy platform that unified fragmented, paper-based distributor
          operations into a single operational backbone across multiple companies and branches.
        </p>

        <div class="flex flex-wrap gap-2 mb-6">
        <span class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary">
          Distribution
        </span>
          <span class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary">
          Inventory
        </span>
          <span class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary">
          Sales Operations
        </span>
        </div>

        <div class="space-y-6">
          <div>
            <p class="label-mono ">Context & constraints</p>
            <p>
              A large Laravel monolith used daily by two distributor companies and all their branches.
              The system had minimal automated testing, duplicated business logic, and real-time
              operational tables. Architectural change carried high risk, limiting scalability
              primarily to vertical approaches.
            </p>
          </div>

          <div>
            <p class="label-mono ">My responsibility</p>
            <p>
              Inherited and maintained the system in production. Led incremental refactoring in
              high-risk areas, introduced unit testing for critical calculations, resolved major
              tax-calculation defects, and supported rollout to additional branch offices. Shared
              direct responsibility for production stability within a small core team.
            </p>
          </div>

          <div>
            <p class="label-mono ">Outcome</p>
            <p>
              Replaced branch-isolated and paper-based workflows with a centralized system relied on
              for daily operations. Improved data consistency, reduced manual reconciliation, and
              enabled real-time visibility across distributor branches.
            </p>
          </div>

          <p>
            <router-link to="/case-studies#twin-v1">
              → View case study
            </router-link>
          </p>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
// Systems view
</script>
