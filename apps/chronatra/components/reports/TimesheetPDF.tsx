import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { TimeEntry, Project } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/utils'; // You might need to duplicate specific utils if these use DOM/canvas

// Create styles
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
    borderBottomColor: '#EEEEEE',
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
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#EEEEEE',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#EEEEEE',
    backgroundColor: '#F9FAFB',
    padding: 5,
  },
  tableColDescription: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#EEEEEE',
    backgroundColor: '#F9FAFB',
    padding: 5,
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#EEEEEE',
    padding: 5,
  },
  tableColDesc: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#EEEEEE',
    padding: 5,
  },
  tableCellHeader: {
    margin: 2,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#444444',
  },
  tableCell: {
    margin: 2,
    fontSize: 10,
    color: '#333333',
  },
});

interface TimesheetPDFProps {
  entries: TimeEntry[];
  projects: Project[];
  startDate: Date;
  endDate: Date;
  userName?: string;
}

const TimesheetPDF = ({ entries, projects, startDate, endDate, userName }: TimesheetPDFProps) => {
  const totalDuration = entries.reduce((acc, entry) => acc + (entry.duration || 0), 0);
  
  // Format seconds helper
  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formattedStart = startDate.toLocaleDateString();
  const formattedEnd = endDate.toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Timesheet Report</Text>
          <Text style={styles.subtitle}>Generated for: {userName || 'User'}</Text>
          <Text style={styles.subtitle}>Period: {formattedStart} - {formattedEnd}</Text>
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
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Date</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Project</Text>
            </View>
            <View style={styles.tableColDescription}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Duration</Text>
            </View>
          </View>
          
          {entries.map((entry) => {
             const project = projects.find(p => p.id === entry.projectId);
             // handle Firestore Timestamp safely
             const date = (entry.startTime as any).toDate 
                ? (entry.startTime as any).toDate() 
                : new Date(entry.startTime as any);
             
             return (
              <View style={styles.tableRow} key={entry.id}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{date.toLocaleDateString()}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{project?.name || '-'}</Text>
                </View>
                <View style={styles.tableColDesc}>
                  <Text style={styles.tableCell}>{entry.description || 'No description'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{formatDuration(entry.duration || 0)}</Text>
                </View>
              </View>
             );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default TimesheetPDF;
