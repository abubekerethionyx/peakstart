#!/usr/bin/env python3
"""
Test script to verify the Cost model fix
"""
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app import app
from backend.models import Cost, DailyActivity, Site, Worker
from backend.extensions import db

def test_cost_model():
    """Test the Cost model to_dict method"""
    with app.app_context():
        try:
            # Try to get a cost record
            cost = Cost.query.first()
            if cost:
                print("Testing Cost model to_dict method...")
                cost_dict = cost.to_dict()
                print("✅ Cost model to_dict works correctly!")
                print(f"Cost data: {cost_dict}")
            else:
                print("No cost records found in database")
                
            # Test creating a new cost
            print("\nTesting cost creation...")
            site = Site.query.first()
            if site:
                test_cost = Cost(
                    site_id=site.id,
                    cost_type='test',
                    description='Test cost',
                    amount=100.0,
                    date='2024-01-01'
                )
                db.session.add(test_cost)
                db.session.commit()
                print("✅ Cost creation works!")
                
                # Test to_dict on new cost
                test_dict = test_cost.to_dict()
                print(f"✅ New cost to_dict works: {test_dict}")
                
                # Clean up
                db.session.delete(test_cost)
                db.session.commit()
                print("✅ Cleanup completed")
            else:
                print("No sites found in database")
                
        except Exception as e:
            print(f"❌ Error testing Cost model: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_cost_model()
