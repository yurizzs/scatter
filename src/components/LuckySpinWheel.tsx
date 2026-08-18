import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableOpacity, Dimensions } from 'react-native';
import { CasinoColors } from '@/constants/CasinoTheme';
import { Ionicons } from '@expo/vector-icons';
import Svg, { G, Path, Text as SvgText, Circle } from 'react-native-svg';

export interface Sector {
  label: string;
  value: number;
  color: string;
  textColor: string;
}

export const WHEEL_SECTORS: Sector[] = [
  { label: '+₱10', value: 10, color: '#0D382A', textColor: '#FFD700' },
  { label: '+₱25', value: 25, color: '#DFB15B', textColor: '#041710' },
  { label: '+₱50', value: 50, color: '#0D382A', textColor: '#FFD700' },
  { label: '+₱100', value: 100, color: '#FFD700', textColor: '#041710' },
  { label: '+₱200', value: 200, color: '#0D382A', textColor: '#FFD700' },
  { label: 'Try Again', value: 0, color: '#103E2F', textColor: '#94A3B8' },
  { label: 'Bonus ₱250', value: 250, color: '#DFB15B', textColor: '#041710' },
  { label: 'JACKPOT ₱500', value: 500, color: '#B8860B', textColor: '#FFFFFF' },
];

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width * 0.85, 330);
const RADIUS = WHEEL_SIZE / 2;
const NUM_SECTORS = WHEEL_SECTORS.length;
const ANGLE_PER_SECTOR = 360 / NUM_SECTORS;

interface LuckySpinWheelProps {
  onSpinEnd: (sector: Sector) => void;
}

export const LuckySpinWheel: React.FC<LuckySpinWheelProps> = ({ onSpinEnd }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [lastAngle, setLastAngle] = useState(0);

  // Helper to calculate SVG wedge slice path
  const getSectorPath = (index: number) => {
    const startAngle = (index * ANGLE_PER_SECTOR - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * ANGLE_PER_SECTOR - 90) * (Math.PI / 180);

    const x1 = RADIUS + RADIUS * Math.cos(startAngle);
    const y1 = RADIUS + RADIUS * Math.sin(startAngle);

    const x2 = RADIUS + RADIUS * Math.cos(endAngle);
    const y2 = RADIUS + RADIUS * Math.sin(endAngle);

    return `M ${RADIUS} ${RADIUS} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2} Z`;
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Pick random target sector
    const winningIndex = Math.floor(Math.random() * NUM_SECTORS);
    const winningSector = WHEEL_SECTORS[winningIndex];

    // Calculate rotation angle so pointer (top at 0 deg / 270 rad) points to winningSector
    // Pointer is at the top (0 degrees rotation relative to wheel center)
    // Sector i spans [i * ANGLE, (i+1) * ANGLE]
    const sectorCenterAngle = winningIndex * ANGLE_PER_SECTOR + ANGLE_PER_SECTOR / 2;
    // To position sectorCenterAngle at top (0 deg), we rotate wheel by 360 - sectorCenterAngle
    const targetSectorRotation = 360 - sectorCenterAngle;
    
    // Add 5 to 8 full revolutions (1800 - 2880 deg) for dramatic casino spin animation
    const extraTurns = (5 + Math.floor(Math.random() * 3)) * 360;
    const totalRotation = lastAngle + extraTurns + targetSectorRotation - (lastAngle % 360);

    Animated.timing(spinValue, {
      toValue: totalRotation,
      duration: 4500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setLastAngle(totalRotation);
      setIsSpinning(false);
      onSpinEnd(winningSector);
    });
  };

  const spinInterpolation = spinValue.interpolate({
    inputRange: [0, 36000],
    outputRange: ['0deg', '36000deg'],
  });

  return (
    <View style={styles.container}>
      {/* Top Pointer Indicator */}
      <View style={styles.pointerContainer}>
        <Ionicons name="caret-down" size={38} color={CasinoColors.goldPrimary} style={styles.pointerShadow} />
      </View>

      {/* Golden Glowing Outer Wheel Frame */}
      <View style={styles.wheelOuterBorder}>
        {/* Animated Rotational SVG Wheel */}
        <Animated.View
          style={[
            styles.wheelContainer,
            {
              transform: [{ rotate: spinInterpolation }],
            },
          ]}
        >
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
            <G>
              {WHEEL_SECTORS.map((sector, i) => {
                const midAngle = ((i + 0.5) * ANGLE_PER_SECTOR - 90) * (Math.PI / 180);
                const textDistance = RADIUS * 0.68;
                const textX = RADIUS + textDistance * Math.cos(midAngle);
                const textY = RADIUS + textDistance * Math.sin(midAngle);
                const textRotation = i * ANGLE_PER_SECTOR + ANGLE_PER_SECTOR / 2 + 90;

                return (
                  <G key={`sector-${i}`}>
                    <Path
                      d={getSectorPath(i)}
                      fill={sector.color}
                      stroke={CasinoColors.borderGold}
                      strokeWidth="1.5"
                    />
                    <SvgText
                      x={textX}
                      y={textY}
                      fill={sector.textColor}
                      fontSize="12.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    >
                      {sector.label}
                    </SvgText>
                  </G>
                );
              })}
              {/* Inner Decorative Golden Ring */}
              <Circle
                cx={RADIUS}
                cy={RADIUS}
                r={RADIUS * 0.28}
                fill={CasinoColors.bgCardElevated}
                stroke={CasinoColors.goldPrimary}
                strokeWidth="2.5"
              />
            </G>
          </Svg>
        </Animated.View>

        {/* Center Hub Scatter Emblem */}
        <View style={styles.centerHub}>
          <Ionicons name="sparkles" size={24} color={CasinoColors.goldPrimary} />
          <Text style={styles.hubText}>SCATTER</Text>
        </View>
      </View>

      {/* Large SPIN Action Button */}
      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
        onPress={handleSpin}
        disabled={isSpinning}
        activeOpacity={0.8}
      >
        <View style={styles.spinButtonInner}>
          <Text style={styles.spinButtonText}>{isSpinning ? 'SPINNING...' : 'SPIN NOW'}</Text>
          {!isSpinning && <Ionicons name="refresh" size={20} color={CasinoColors.bgDarkest} style={{ marginLeft: 6 }} />}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  pointerContainer: {
    zIndex: 10,
    marginBottom: -18,
    alignItems: 'center',
  },
  pointerShadow: {
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 10,
  },
  wheelOuterBorder: {
    width: WHEEL_SIZE + 16,
    height: WHEEL_SIZE + 16,
    borderRadius: (WHEEL_SIZE + 16) / 2,
    borderWidth: 5,
    borderColor: CasinoColors.goldPrimary,
    backgroundColor: CasinoColors.bgDarkest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 12,
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  centerHub: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: CasinoColors.bgDarkest,
    borderWidth: 3,
    borderColor: CasinoColors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  hubText: {
    color: CasinoColors.goldLight,
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 2,
  },
  spinButton: {
    marginTop: 24,
    width: Math.min(width * 0.7, 240),
    height: 52,
    borderRadius: 26,
    backgroundColor: CasinoColors.goldPrimary,
    borderWidth: 2,
    borderColor: CasinoColors.goldGradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CasinoColors.goldPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
  spinButtonDisabled: {
    backgroundColor: CasinoColors.bgCardElevated,
    borderColor: CasinoColors.borderEmerald,
  },
  spinButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButtonText: {
    color: CasinoColors.bgDarkest,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.5,
  },
});
