import Clipboard from '@react-native-clipboard/clipboard';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {palette} from '@theme/palette';
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ApiLogEntry, apiLogger} from '../../utils/apiLogger';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const BUBBLE_SIZE = 50;

interface DebugBubbleProps {
  enabled?: boolean;
}

export const DebugBubble: FC<DebugBubbleProps> = ({enabled = __DEV__}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<ApiLogEntry | null>(null);
  const [activeTab, setActiveTab] = useState<
    'request' | 'response' | 'headers' | 'curl'
  >('request');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const pan = useRef(new Animated.ValueXY({x: SCREEN_WIDTH - 70, y: 100}))
    .current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        // Snap to edges
        const currentX = (pan.x as any)._value;
        const currentY = (pan.y as any)._value;

        let snapX = currentX;
        let snapY = Math.max(50, Math.min(currentY, SCREEN_HEIGHT - 150));

        if (currentX < SCREEN_WIDTH / 2) {
          snapX = 20;
        } else {
          snapX = SCREEN_WIDTH - BUBBLE_SIZE - 20;
        }

        Animated.spring(pan, {
          toValue: {x: snapX, y: snapY},
          useNativeDriver: false,
          friction: 7,
        }).start();

        // If it's a tap (no significant movement), open modal
        if (
          Math.abs(gestureState.dx) < 5 &&
          Math.abs(gestureState.dy) < 5
        ) {
          setIsModalVisible(true);
        }
      },
    }),
  ).current;

  useEffect(() => {
    setLogs(apiLogger.getLogs());
    const unsubscribe = apiLogger.subscribe(() => {
      setLogs(apiLogger.getLogs());
    });
    return unsubscribe;
  }, []);

  const copyToClipboard = useCallback((text: string, field: string) => {
    Clipboard.setString(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }, []);

  const getStatusColor = (status: number | null) => {
    if (!status) return palette.grey;
    if (status >= 200 && status < 300) return '#22C55E';
    if (status >= 400 && status < 500) return '#F59E0B';
    return '#EF4444';
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: '#22C55E',
      POST: '#3B82F6',
      PUT: '#F59E0B',
      PATCH: '#8B5CF6',
      DELETE: '#EF4444',
    };
    return colors[method] || palette.grey;
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderLogItem = ({item}: {item: ApiLogEntry}) => (
    <TouchableOpacity
      style={styles.logItem}
      onPress={() => setSelectedLog(item)}
      activeOpacity={0.7}>
      <View style={styles.logItemHeader}>
        <View
          style={[
            styles.methodBadge,
            {backgroundColor: getMethodColor(item.method)},
          ]}>
          <Text style={styles.methodText}>{item.method}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.responseStatus)},
          ]}>
          <Text style={styles.statusText}>
            {item.responseStatus || 'ERR'}
          </Text>
        </View>
        <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
      </View>
      <Text style={styles.endpointText} numberOfLines={1}>
        {item.endpoint}
      </Text>
      <Text style={styles.timestampText}>
        {formatTimestamp(item.timestamp)}
      </Text>
      {item.error && (
        <Text style={styles.errorText} numberOfLines={1}>
          {item.error}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderDetailView = () => {
    if (!selectedLog) return null;

    const tabs = [
      {key: 'request', label: 'Request'},
      {key: 'response', label: 'Response'},
      {key: 'headers', label: 'Headers'},
      {key: 'curl', label: 'cURL'},
    ] as const;

    return (
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            onPress={() => setSelectedLog(null)}
            style={styles.backButton}>
            <Text style={styles.backButtonText}>{'<'} Back</Text>
          </TouchableOpacity>
          <View style={styles.detailHeaderInfo}>
            <View
              style={[
                styles.methodBadge,
                {backgroundColor: getMethodColor(selectedLog.method)},
              ]}>
              <Text style={styles.methodText}>{selectedLog.method}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(selectedLog.responseStatus)},
              ]}>
              <Text style={styles.statusText}>
                {selectedLog.responseStatus || 'ERR'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.detailUrl} numberOfLines={2}>
          {selectedLog.url}
        </Text>

        <View style={styles.tabContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.detailContent}>
          {activeTab === 'request' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Request Body</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(
                      JSON.stringify(selectedLog.requestBody, null, 2),
                      'request',
                    )
                  }
                  style={styles.copyButton}>
                  <Text style={styles.copyButtonText}>
                    {copiedField === 'request' ? 'Copied!' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>
                  {JSON.stringify(selectedLog.requestBody, null, 2) || 'No body'}
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'response' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Response Body</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(
                      JSON.stringify(selectedLog.responseBody, null, 2),
                      'response',
                    )
                  }
                  style={styles.copyButton}>
                  <Text style={styles.copyButtonText}>
                    {copiedField === 'response' ? 'Copied!' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
              {selectedLog.error && (
                <View style={styles.errorBlock}>
                  <Text style={styles.errorBlockText}>{selectedLog.error}</Text>
                </View>
              )}
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>
                  {JSON.stringify(selectedLog.responseBody, null, 2) ||
                    'No response'}
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'headers' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Request Headers</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(
                      JSON.stringify(selectedLog.requestHeaders, null, 2),
                      'reqHeaders',
                    )
                  }
                  style={styles.copyButton}>
                  <Text style={styles.copyButtonText}>
                    {copiedField === 'reqHeaders' ? 'Copied!' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>
                  {JSON.stringify(selectedLog.requestHeaders, null, 2)}
                </Text>
              </View>

              <View style={[styles.sectionHeader, {marginTop: 16}]}>
                <Text style={styles.sectionTitle}>Response Headers</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(
                      JSON.stringify(selectedLog.responseHeaders, null, 2),
                      'resHeaders',
                    )
                  }
                  style={styles.copyButton}>
                  <Text style={styles.copyButtonText}>
                    {copiedField === 'resHeaders' ? 'Copied!' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>
                  {JSON.stringify(selectedLog.responseHeaders, null, 2) ||
                    'No headers'}
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'curl' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>cURL Command</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(selectedLog.curl, 'curl')}
                  style={styles.copyButton}>
                  <Text style={styles.copyButtonText}>
                    {copiedField === 'curl' ? 'Copied!' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>{selectedLog.curl}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  if (!enabled) return null;

  return (
    <>
      <Animated.View
        style={[
          styles.bubble,
          {
            transform: [{translateX: pan.x}, {translateY: pan.y}],
          },
        ]}
        {...panResponder.panHandlers}>
        <View style={styles.bubbleInner}>
          <Text style={styles.bubbleText}>API</Text>
          {logs.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {logs.length > 99 ? '99+' : logs.length}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setSelectedLog(null);
          setIsModalVisible(false);
        }}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>API Inspector</Text>
            <View style={styles.modalHeaderActions}>
              <TouchableOpacity
                onPress={() => apiLogger.clearLogs()}
                style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <Pressable
                onPress={() => {
                  setSelectedLog(null);
                  setIsModalVisible(false);
                }}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
            </View>
          </View>

          {selectedLog ? (
            renderDetailView()
          ) : (
            <FlatList
              data={logs}
              keyExtractor={item => item.id}
              renderItem={renderLogItem}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No API calls logged yet</Text>
                  <Text style={styles.emptySubtext}>
                    API calls will appear here as they are made
                  </Text>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: palette.cornFlower,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  bubbleInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#374151',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 12,
  },
  logItem: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: palette.cornFlower,
  },
  logItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  methodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  methodText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  durationText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 'auto',
  },
  endpointText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  timestampText: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 14,
  },
  detailContainer: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: palette.cornFlower,
    fontSize: 16,
  },
  detailHeaderInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  detailUrl: {
    color: '#9CA3AF',
    fontSize: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'monospace',
    backgroundColor: '#0f0f23',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: palette.cornFlower,
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  activeTabText: {
    color: palette.cornFlower,
    fontWeight: 'bold',
  },
  detailContent: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: 'bold',
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: palette.cornFlower,
    borderRadius: 4,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  codeBlock: {
    backgroundColor: '#0f0f23',
    borderRadius: 8,
    padding: 12,
  },
  codeText: {
    color: '#22D3EE',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  errorBlock: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorBlockText: {
    color: '#EF4444',
    fontSize: 12,
  },
});
