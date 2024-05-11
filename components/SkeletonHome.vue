<script setup lang="ts">
          import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
          import { VisAxis, VisXYContainer, VisStackedBar } from '@unovis/vue';
          import { Input } from '@/components/ui/input';
          import { Skeleton } from '@/components/ui/skeleton';
          import type { RouteCount } from '~/lib/definition';
          import {
                    Table,
                    TableBody,
                    TableCell,
                    TableHead,
                    TableHeader,
                    TableRow,
          } from '@/components/ui/table';

          const data = [
                    {
                              level: 1,
                              amount: Math.floor(Math.random() * 10) + 1,
                    },
                    {
                              level: 2,
                              amount: Math.floor(Math.random() * 10) + 1,
                    },
                    {
                              level: 3,
                              amount: Math.floor(Math.random() * 20) + 1,
                    },
                    {
                              level: 4,
                              amount: Math.floor(Math.random() * 20) + 1,
                    },
                    {
                              level: 5,
                              amount: Math.floor(Math.random() * 20) + 1,
                    },
                    {
                              level: 6,
                              amount: Math.floor(Math.random() * 5) + 1,
                    },
                    {
                              level: 7,
                              amount: Math.floor(Math.random() * 5) + 1,
                    },
          ];
</script>

<template>
          <div class="grid gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card v-for="index in 4" :key="index">
                              <CardHeader>
                                        <CardTitle>
                                                  <Skeleton class="h-6 w-[150px]" />
                                        </CardTitle>
                              </CardHeader>
                              <CardContent class="w-full p-4">
                                        <div class="space-y-4">
                                                  <div v-for="index in 1" class="space-y-2" :key="index">
                                                            <Skeleton v-for="index in 3" class="h-4 w-[200px]"
                                                                      :key="index" />
                                                  </div>
                                        </div>
                              </CardContent>
                    </Card>
          </div>
          <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    <Card>
                              <CardContent>
                                        <div class="flex items-center py-4">
                                                  <Input class="max-w-sm" placeholder="Filter zone..." />
                                        </div>
                                        <Table>
                                                  <TableHeader>
                                                            <TableRow>
                                                                      <TableHead>
                                                                                <Skeleton class="h-4 w-8" />
                                                                      </TableHead>
                                                                      <TableHead>
                                                                                <Skeleton class="h-4 w-60" />
                                                                      </TableHead>
                                                                      <TableHead>
                                                                                <Skeleton class="h-4 w-full" />
                                                                      </TableHead>
                                                                      <TableHead>
                                                                                <Skeleton class="h-4 w-20" />
                                                                      </TableHead>
                                                                      <TableHead>
                                                                                <Skeleton class="h-4 w-30" />
                                                                      </TableHead>
                                                            </TableRow>
                                                  </TableHeader>
                                                  <TableBody>
                                                            <TableRow v-for="index in 10" :key="index">
                                                                      <TableCell>
                                                                                <Skeleton class="h-4 w-8" />
                                                                      </TableCell>
                                                                      <TableCell>
                                                                                <Skeleton class="h-4 w-60" />
                                                                      </TableCell>
                                                                      <TableCell>
                                                                                <Skeleton class="h-4 w-full" />
                                                                      </TableCell>
                                                                      <TableCell>
                                                                                <Skeleton class="h-4 w-20" />
                                                                      </TableCell>
                                                                      <TableCell>
                                                                                <Skeleton class="h-4 w-30" />
                                                                      </TableCell>
                                                            </TableRow>
                                                  </TableBody>
                                        </Table>
                              </CardContent>
                    </Card>
                    <Card class="flex flex-col justify-center items-center">
                              <CardHeader class="flex flex-col justify-center items-center">
                                        <CardTitle>
                                                  <Skeleton class="h-8 w-60" />
                                        </CardTitle>
                              </CardHeader>
                              <CardContent>
                                        <VisXYContainer :margin="{ left: 20, right: 20 }" :data="data" :style="{
                                                  opacity: 1,
                                                  '--theme-primary': `hsl(var(--primary))`,
                                                  '--theme-text': `hsl(var(--foreground))`,
                                                  '--theme-muted': `hsl(var(--muted))`,
                                        }">
                                                  <VisStackedBar :x="(___d: RouteCount, i: number) => i"
                                                            :y="(d: RouteCount) => d.amount" color="var(--theme-muted)"
                                                            :rounded-corners="4" :bar-padding="0.05" />
                                                  <VisAxis type="x" :num-ticks="data.length"
                                                            :tick-format="(index: number) => 'Lvl' + ' ' + data[index]?.level"
                                                            tickTextColor="var(--theme-text)" :grid-line="false"
                                                            :tick-line="true" />
                                                  <VisAxis type="y" :num-ticks="data.length"
                                                            :tick-format="(index: number) => data[index]?.level"
                                                            :grid-line="false" :tick-line="false" :domain-line="false"
                                                            tickTextColor="var(--theme-text)" />
                                        </VisXYContainer>
                              </CardContent>
                    </Card>
          </div>
</template>
