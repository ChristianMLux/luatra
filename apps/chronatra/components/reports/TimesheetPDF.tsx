import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { TimeEntry, Project } from '@/lib/types';
import {
  WEEKLY_TARGET_HOURS,
  entryDate,
  formatWeekDiff,
  hoursAboveTarget,
  summarizeWeeks,
} from '@/lib/reportStats';

const BORDER = '#EEEEEE';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#111111',
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 40,
  },
  statItem: {
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: 10,
    color: '#666666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 13,
    marginTop: 20,
    marginBottom: 8,
    color: '#111111',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: BORDER,
  },
  tableRow: {
    flexDirection: 'row',
  },
  cell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: BORDER,
    padding: 5,
  },
  headerCell: {
    backgroundColor: '#F9FAFB',
  },
  cellText: {
    fontSize: 9,
    color: '#333333',
  },
  headerText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#444444',
  },
  note: {
    fontSize: 8,
    color: '#666666',
    marginTop: 6,
  },
});

// Column widths per table; each set adds up to 100%.
const ENTRY_COLUMNS = ['13%', '9%', '9%', '17%', '38%', '14%'];
const WEEK_COLUMNS = ['50%', '25%', '25%'];

function Row({ cells, widths, header = false }: { cells: string[]; widths: string[]; header?: boolean }) {
  return (
    <View style={styles.tableRow} wrap={false}>
      {cells.map((text, i) => (
        <View key={i} style={[styles.cell, { width: widths[i] }, header ? styles.headerCell : {}]}>
          <Text style={header ? styles.headerText : styles.cellText}>{text}</Text>
        </View>
      ))}
    </View>
  );
}

interface TimesheetPDFProps {
  entries: TimeEntry[];
  projects: Project[];
  startDate: Date;
  endDate: Date;
  userName?: string;
}

const formatDuration = (ms: number) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
};

const TimesheetPDF = ({ entries, projects, startDate, endDate, userName }: TimesheetPDFProps) => {
  const totalDuration = entries.reduce((acc, entry) => acc + (entry.duration || 0), 0);
  const projectNames = new Map(projects.map((p) => [p.id, p.name]));
  const weeks = summarizeWeeks(entries, { start: startDate, end: endDate });
  // Chronological order reads like a timesheet; the app lists newest first.
  const rows = [...entries].sort(
    (a, b) => (entryDate(a.startTime)?.getTime() ?? 0) - (entryDate(b.startTime)?.getTime() ?? 0),
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Timesheet Report</Text>
          <Text style={styles.subtitle}>Generated for: {userName || 'User'}</Text>
          <Text style={styles.subtitle}>
            Period: {format(startDate, 'dd.MM.yyyy')} - {format(endDate, 'dd.MM.yyyy')}
          </Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Time</Text>
            <Text style={styles.statValue}>{formatDuration(totalDuration)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Entries</Text>
            <Text style={styles.statValue}>{entries.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Hours above {WEEKLY_TARGET_HOURS} h/week</Text>
            <Text style={styles.statValue}>{hoursAboveTarget(weeks).toFixed(1)} h</Text>
          </View>
        </View>

        <View style={styles.table}>
          <Row header widths={ENTRY_COLUMNS} cells={['Date', 'Start', 'End', 'Project', 'Description', 'Duration']} />
          {rows.map((entry) => {
            const start = entryDate(entry.startTime);
            const end = entryDate(entry.endTime);
            return (
              <Row
                key={entry.id}
                widths={ENTRY_COLUMNS}
                cells={[
                  start ? format(start, 'dd.MM.yyyy') : '-',
                  start ? format(start, 'HH:mm') : '-',
                  end ? format(end, 'HH:mm') : '-',
                  (entry.projectId && projectNames.get(entry.projectId)) || '-',
                  entry.description || 'No description',
                  `${formatDuration(entry.duration || 0)}${entry.correction ? ' *' : ''}`,
                ]}
              />
            );
          })}
        </View>

        {entries.some((entry) => entry.correction) && (
          <Text style={styles.note}>
            * End time entered afterwards because the timer was left running.
          </Text>
        )}

        <Text style={styles.sectionTitle}>Weekly overview</Text>
        <View style={styles.table}>
          <Row header widths={WEEK_COLUMNS} cells={['Week', 'Hours', `vs. ${WEEKLY_TARGET_HOURS} h`]} />
          {weeks.map((week) => (
            <Row
              key={week.weekStart.getTime()}
              widths={WEEK_COLUMNS}
              cells={[week.label, formatDuration(week.totalMs), formatWeekDiff(week)]}
            />
          ))}
        </View>
        <Text style={styles.note}>
          Target {WEEKLY_TARGET_HOURS} h per full week; public holidays and vacation are not deducted. Durations run from start to end of each entry, so breaks taken without stopping the timer are included.
        </Text>
      </Page>
    </Document>
  );
};

export default TimesheetPDF;
