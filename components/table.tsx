import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
  } from '@tremor/react';
import { AllLogData } from '@/components/homePage';
  
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }
  
  export default function LogTable({ allLogs }: { allLogs: AllLogData[] }) {
    // Sort logs by timestamp in descending order (latest first)
    const sortedLogs = [...allLogs].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return (
      <>
        <div className="sm:flex sm:items-center sm:justify-between sm:space-x-10">
          <div>
            <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Log History
            </h3>
          </div>
        </div>
        {sortedLogs.length === 0 ? (
          <div className="mt-8 text-center text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            No logs available. Start fetching to see the data.
          </div>
        ) : (
          <Table className="mt-8 max-h-[250px] overflow-y-auto relative">
              <TableHead className="sticky top-0 bg-white dark:bg-black z-10">
                <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
                  <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Timestamp
                  </TableHeaderCell>
                  <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Domain
                  </TableHeaderCell>
                  <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Source
                  </TableHeaderCell>
                  <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Destination
                  </TableHeaderCell>
                  <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Threat Level
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <span
                        className={classNames(
                          'bg-red-100 text-red-800 ring-red-600/10 dark:bg-red-500/20 dark:text-red-500 dark:ring-red-400/20',
                          'inline-flex items-center rounded-tremor-small px-2 py-0.5 text-tremor-label font-medium ring-1 ring-inset'
                        )}
                      >
                        {log.Domain}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={classNames(
                          'bg-yellow-100 text-yellow-800 ring-yellow-600/10 dark:bg-yellow-500/20 dark:text-yellow-500 dark:ring-yellow-400/20',
                          'inline-flex items-center rounded-tremor-small px-2 py-0.5 text-tremor-label font-medium ring-1 ring-inset'
                        )}
                      >
                        {log.Source}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={classNames(
                          'bg-green-100 text-green-800 ring-green-600/10 dark:bg-green-500/20 dark:text-green-500 dark:ring-green-400/20',
                          'inline-flex items-center rounded-tremor-small px-2 py-0.5 text-tremor-label font-medium ring-1 ring-inset'
                        )}
                      >
                        {log.Destination}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={classNames(
                          'bg-green-100 text-green-800 ring-green-600/10 dark:bg-green-500/20 dark:text-green-500 dark:ring-green-400/20',
                          'inline-flex items-center rounded-tremor-small px-2 py-0.5 text-tremor-label font-medium ring-1 ring-inset'
                        )}
                      >
                        {log.ThreatLevel}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
        )}
      </>
    );
  }