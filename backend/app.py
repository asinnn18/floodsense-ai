import os
import random
import time
import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

LOCATIONS = {
    "silk_board": {"id": "silk_board", "name": "Silk Board Junction", "coords": [12.9176, 77.6233], "drain_id": "D-452", "priority_infra": []},
    "koramangala": {"id": "koramangala", "name": "Koramangala 80ft Rd", "coords": [12.9352, 77.6245], "drain_id": "D-102", "priority_infra": ["St. John's Hospital"]},
    "whitefield": {"id": "whitefield", "name": "Whitefield Main Rd", "coords": [12.9698, 77.7500], "drain_id": "D-881", "priority_infra": ["Vydehi Hospital", "DPS Whitefield"]},
    "marathahalli": {"id": "marathahalli", "name": "Marathahalli Bridge", "coords": [12.9562, 77.7011], "drain_id": "D-223", "priority_infra": []},
    "indiranagar": {"id": "indiranagar", "name": "Indiranagar 100ft Rd", "coords": [12.9719, 77.6412], "drain_id": "D-056", "priority_infra": ["National Public School"]},
    "electronic_city": {"id": "electronic_city", "name": "Electronic City Phase 1", "coords": [12.8452, 77.6632], "drain_id": "D-990", "priority_infra": []}
}

# Generate Fake MAC addresses for IoT sensors
def gen_mac():
    return "00:1A:2B:" + ":".join(["%02X" % random.randint(0, 255) for _ in range(3)])

state = {
    "weather": {
        "rainfall_intensity": 0,
        "forecast": "Cloudy",
        "last_updated": datetime.now().isoformat()
    },
    "drains": {loc_id: {
        "id": LOCATIONS[loc_id]["drain_id"],
        "sensor_mac": gen_mac(),
        "battery_pct": random.randint(45, 98),
        "last_ping_ms": int(time.time() * 1000),
        "blockage_risk": random.randint(10, 40),
        "garbage_density": random.randint(5, 30),
        "status": "Clear",
        "iot_water_level_cm": random.uniform(10.0, 30.0), 
        "iot_flow_rate_Lps": random.uniform(50.0, 100.0) 
    } for loc_id in LOCATIONS},
    "flood_risk": {loc_id: {
        "risk_level": "Low",
        "score": 10,
        "time_to_flood": "None",
        "resource_needs": {"pumps": 0, "workers": 0}
    } for loc_id in LOCATIONS},
    "reports": [],
    "tasks": [],
    "impact": {
        "economic_loss_saved_cr": 0.0,
        "traffic_delay_reduced_pct": 0,
        "incidents_prevented": 0
    },
    "raw_iot_feed": [] # Holds last 20 raw sensor packets
}

def update_simulation():
    current_time_ms = int(time.time() * 1000)
    
    state["weather"]["rainfall_intensity"] = random.randint(0, 80)
    if state["weather"]["rainfall_intensity"] > 60:
        state["weather"]["forecast"] = "Heavy Rain"
    elif state["weather"]["rainfall_intensity"] > 30:
        state["weather"]["forecast"] = "Moderate Rain"
    else:
        state["weather"]["forecast"] = "Light Drizzle"
    
    for loc_id, drain in state["drains"].items():
        drain["blockage_risk"] += (state["weather"]["rainfall_intensity"] / 10) + (drain["garbage_density"] / 5)
        drain["blockage_risk"] = min(100, drain["blockage_risk"])
        
        drain["iot_water_level_cm"] = min(200.0, max(10.0, drain["iot_water_level_cm"] + (state["weather"]["rainfall_intensity"] / 5) - (5 if drain["blockage_risk"] < 50 else -2)))
        drain["iot_flow_rate_Lps"] = max(10.0, 100.0 - drain["blockage_risk"] + random.uniform(-2.0, 2.0))
        drain["last_ping_ms"] = current_time_ms - random.randint(10, 500)
        
        # Slowly drain battery
        if random.random() > 0.9:
            drain["battery_pct"] = max(0, drain["battery_pct"] - 1)

        if drain["blockage_risk"] > 80:
            drain["status"] = "Critical"
        elif drain["blockage_risk"] > 50:
            drain["status"] = "Blocked"
        else:
            drain["status"] = "Clear"
            
        # Append to raw feed
        state["raw_iot_feed"].insert(0, {
            "timestamp": datetime.now().isoformat() + "Z",
            "mac": drain["sensor_mac"],
            "drain_id": drain["id"],
            "flow_lps": round(drain["iot_flow_rate_Lps"], 4),
            "level_cm": round(drain["iot_water_level_cm"], 4),
            "batt": drain["battery_pct"],
            "signal_dbm": random.randint(-85, -45)
        })

    # Keep only last 50 packets to simulate a scrolling feed
    state["raw_iot_feed"] = state["raw_iot_feed"][:50]

    for loc_id, risk in state["flood_risk"].items():
        drain_score = state["drains"][loc_id]["blockage_risk"]
        rain_intensity = state["weather"]["rainfall_intensity"]
        water_level = state["drains"][loc_id]["iot_water_level_cm"]
        
        score = (rain_intensity * 0.4) + (drain_score * 0.4) + (water_level * 0.2)
        risk["score"] = round(min(100, score), 1)
        
        if score > 75:
            risk["risk_level"] = "High"
            risk["time_to_flood"] = f"{random.randint(20, 60)} mins"
            risk["resource_needs"] = {"pumps": random.randint(2, 5), "workers": random.randint(5, 12)}
            state["impact"]["incidents_prevented"] += 1
            state["impact"]["economic_loss_saved_cr"] += 0.45
            state["impact"]["traffic_delay_reduced_pct"] = min(100, state["impact"]["traffic_delay_reduced_pct"] + random.randint(1,3))
        elif score > 45:
            risk["risk_level"] = "Medium"
            risk["time_to_flood"] = f"{random.randint(60, 120)} mins"
            risk["resource_needs"] = {"pumps": random.randint(0, 1), "workers": random.randint(2, 5)}
        else:
            risk["risk_level"] = "Low"
            risk["time_to_flood"] = "None"
            risk["resource_needs"] = {"pumps": 0, "workers": 0}

@app.route('/api/status', methods=['GET'])
def get_status():
    update_simulation() 
    return jsonify({
        "locations": LOCATIONS,
        "weather": state["weather"],
        "drains": state["drains"],
        "flood_risk": state["flood_risk"],
        "reports": state["reports"],
        "tasks": state["tasks"],
        "impact": state["impact"],
        "raw_iot_feed": state["raw_iot_feed"]
    })

@app.route('/api/report', methods=['POST'])
def add_report():
    data = request.json
    report = {
        "id": len(state["reports"]) + 1,
        "location": data.get("location", "Unknown"),
        "type": data.get("type", "Drainage"),
        "description": data.get("description", ""),
        "timestamp": datetime.now().isoformat(),
        "verified": True,
        "ai_analysis": "Confirmed blockage. Visual evidence matches IoT flow restriction patterns."
    }
    state["reports"].append(report)
    
    state["tasks"].append({
        "id": len(state["tasks"]) + 1,
        "drain_id": LOCATIONS.get(data.get("location_id"), {}).get("drain_id", "N/A"),
        "priority": "Critical",
        "action": "Clear blockage reported by citizen network",
        "status": "Pending"
    })
    
    return jsonify({"status": "success", "report": report})

@app.route('/api/tasks/update', methods=['POST'])
def update_task():
    data = request.json
    task_id = data.get("id")
    for task in state["tasks"]:
        if task["id"] == task_id:
            task["status"] = data.get("status", "Completed")
            break
    return jsonify({"status": "success"})

@app.route('/api/chat', methods=['POST'])
def chat_bot():
    data = request.json
    msg = data.get("message", "").lower()
    
    response = "I am FloodBot, your AI assistant. I'm monitoring the city's drainage network in real-time."
    
    if "safe route" in msg or "travel" in msg:
        response = "Based on current predictions, Hosur Road and NICE Road are safe. Avoid Silk Board junction as IoT sensors indicate rising water levels."
    elif "koramangala" in msg:
        if state["flood_risk"]["koramangala"]["risk_level"] == "High":
             response = "Koramangala is currently at HIGH RISK. Priority infrastructure like St. John's Hospital is being monitored. Please avoid the area."
        else:
             response = "Koramangala is currently safe, but we are monitoring drain D-102 closely."
    elif "deploy" in msg or "workers" in msg:
        critical_drains = [d for d in state["drains"].values() if d["status"] == "Critical"]
        if critical_drains:
            response = f"I recommend deploying {len(critical_drains)*3} workers and {len(critical_drains)} pumps to the critical drains immediately."
        else:
            response = "No immediate worker deployment required. All drains are operating within safe parameters."
            
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
