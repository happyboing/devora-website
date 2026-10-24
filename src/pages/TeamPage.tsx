import { orgChart } from '@/data/team'
import { SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Avatar } from '@/components/ui/Avatar'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

/**
 * The organisational chart, drawn as a pyramid: the Team Leader sits at the
 * apex, the three departments form the middle rung, and each department's
 * members hang beneath their own header on a connector spine.
 *
 * The connector lines are decoration only, so every one of them is hidden from
 * assistive technology and the chart reads as a plain nested list instead.
 */
export function TeamPage() {
  return (
    <section className="relative pb-24 pt-6 sm:pb-32 sm:pt-10 lg:pt-14">
      <div className="shell-wide">
        <SectionHeading
          eyebrow="Organizational Chart"
          title={orgChart.heading}
          lead={orgChart.description}
          align="center"
          as="h1"
        />

        <Reveal y={24} className="mt-14">
          <div className="mx-auto max-w-5xl">
            {/* ---------------------------- Apex ---------------------------- */}
            <div className="flex flex-col items-center">
              <SpotlightCard className="panel panel-hover w-full max-w-md overflow-hidden p-6 text-center sm:p-7">
                <Avatar
                  name={orgChart.leader.name}
                  photo={orgChart.leader.photo}
                  className="mx-auto size-20"
                />
                <p className="t-mono mt-5 text-aura-soft">{orgChart.leaderLabel}</p>
                <h2 className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2rem)] tracking-tight text-frost">
                  {orgChart.leader.name}
                </h2>
                <p className="mt-2 text-sm text-mist">{orgChart.leader.role}</p>
                <p className="mt-3 text-sm text-ash">{orgChart.leader.responsibility}</p>
              </SpotlightCard>

              <span
                aria-hidden="true"
                className="h-10 w-px bg-linear-to-b from-aura/60 to-white/15"
              />
            </div>

            {/* ------------------- Bus joining the three ------------------- */}
            <div aria-hidden="true" className="relative hidden h-px lg:block">
              <span className="absolute inset-x-[16.6667%] top-0 h-px bg-white/15" />
            </div>

            {/* --------------------- Departments + members ------------------ */}
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-6">
              {orgChart.departments.map((department) => (
                <div key={department.id} className="flex flex-col">
                  <span aria-hidden="true" className="mx-auto hidden h-10 w-px bg-white/15 lg:block" />

                  <SpotlightCard className="panel overflow-hidden p-5 text-center">
                    <h3 className="t-mono text-aura-soft">{department.name}</h3>
                    <p className="mt-2 text-sm text-ash">{department.summary}</p>
                  </SpotlightCard>

                  <span aria-hidden="true" className="mx-auto h-5 w-px bg-white/15" />

                  <ul className="flex flex-col">
                    {department.members.map((member, index) => (
                      <li key={member.id} className="flex flex-col">
                        {index > 0 && (
                          <span aria-hidden="true" className="mx-auto h-5 w-px bg-white/15" />
                        )}

                        <SpotlightCard className="panel panel-hover overflow-hidden p-5">
                          <div className="flex items-start gap-4">
                            <Avatar name={member.name} photo={member.photo} className="size-14" />
                            <div className="min-w-0 flex-1">
                              <p className="font-display text-base tracking-tight text-frost">
                                {member.name}
                              </p>
                              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-aura-soft">
                                {member.role}
                              </p>
                              <p className="mt-2 text-sm text-ash">{member.responsibility}</p>
                            </div>
                          </div>
                        </SpotlightCard>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal y={18} className="mt-12 text-center">
          <p className="text-sm text-dusk">
            All nine members are listed with their exact names, roles and responsibilities.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
