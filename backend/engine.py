
"""
CivicLogic Intelligence Engine - Rule-Based Reasoning
This module handles the extraction of meaningful alerts from raw AI perception data.
"""

class RuleEngine:
    def __init__(self):
        self.traffic_threshold = 30  # vehicles per segment
        self.loitering_limit = 120    # seconds
        self.velocity_change_threshold = 40.0 # m/s^2 (acceleration spike)

    def process_traffic_density(self, vehicle_count):
        """Rule: High density triggers congestion alerts."""
        status = "NOMINAL"
        if vehicle_count > self.traffic_threshold:
            status = "CONGESTED"
        return {
            "density": vehicle_count,
            "status": status,
            "level": "High" if status == "CONGESTED" else "Normal"
        }

    def check_red_light_violation(self, vehicle_coords, stop_line_y, traffic_light_state):
        """Rule: Stop-line crossing during RED state."""
        if traffic_light_state == "RED":
            # Assuming vehicle_coords is [x1, y1, x2, y2]
            if vehicle_coords[3] > stop_line_y:
                return {
                    "violation": "RED_LIGHT_CROSSING",
                    "severity": "CRITICAL",
                    "timestamp": "ISO_TIMESTAMP"
                }
        return None

    def detect_sudden_stop(self, velocity_history):
        """Rule: Anomaly detection via temporal frame comparison (acceleration/deceleration)."""
        if len(velocity_history) < 2:
            return None
        
        acceleration = abs(velocity_history[-1] - velocity_history[-2])
        if acceleration > self.velocity_change_threshold:
            return {
                "type": "SUDDEN_BRAKING",
                "delta_v": acceleration,
                "potential_accident": True
            }
        return None

    def detect_loitering(self, person_id, duration):
        """Rule: Stationery objects in sensitive zones exceeding limits."""
        if duration > self.loitering_limit:
            return {
                "subject_id": person_id,
                "violation": "LOITERING",
                "duration": duration,
                "action_required": "Security Check"
            }
        return None

    def calculate_compliance_score(self, total_vessels, total_violations):
        """Rule: Macro city health score calculation."""
        if total_vessels == 0: return 100
        violation_rate = (total_violations / total_vessels) * 100
        score = max(0, 100 - violation_rate)
        return round(score, 2)

# Singleton Instance
engine = RuleEngine()
