from typing import Dict, List, Any
import time

class RiskModel:
    def __init__(self):
        self.severity_weights = {
            'high': 10,
            'medium': 5,
            'low': 2
        }

        self.type_weights = {
            'email': 15,
            'phone': 15,
            'ssn': 20,
            'creditCard': 20,
            'address': 10,
            'birthDate': 8,
            'fullName': 6,
            'location': 5,
            'age': 3,
            'personalInfo': 2
        }

        self.platform_multipliers = {
            'instagram': 1.2,
            'facebook': 1.1,
            'twitter': 1.0,
            'linkedin': 0.9,
            'reddit': 1.3
        }

    def calculate_risk_score(self, analysis_data: List[Dict]) -> int:
        """Calculate overall risk score from analysis data"""
        if not analysis_data:
            return 0

        total_score = 0
        max_possible_score = 0

        for platform_data in analysis_data:
            platform = platform_data.get('platform', 'unknown')
            findings = platform_data.get('findings', [])
            platform_multiplier = self.platform_multipliers.get(platform, 1.0)

            for finding in findings:
                severity_weight = self.severity_weights.get(finding.get('severity'), 1)
                type_weight = self.type_weights.get(finding.get('type'), 5)
                confidence_multiplier = (finding.get('confidence', 70) / 100)

                finding_score = severity_weight * type_weight * confidence_multiplier * platform_multiplier
                total_score += finding_score

            max_findings = max(len(findings), 10)
            max_possible_score += max_findings * 20 * 1.0 * platform_multiplier

        if max_possible_score == 0:
            return 0
        
        normalized_score = min(100, (total_score / max_possible_score) * 100)
        
        total_findings = sum(len(data.get('findings', [])) for data in analysis_data)
        unique_types = len(set(
            finding.get('type')
            for data in analysis_data
            for finding in data.get('findings', [])
        ))

        if total_findings > 5:
            normalized_score *= 1.1
        if total_findings > 10:
            normalized_score *= 1.2
        if unique_types > 3:
            normalized_score *= 1.1

        return min(100, round(normalized_score))

    def get_risk_level(self, score: int) -> str:
        """Get risk level based on score"""
        if score >= 80:
            return 'critical'
        elif score >= 60:
            return 'high'
        elif score >= 40:
            return 'medium'
        elif score >= 20:
            return 'low'
        else:
            return 'minimal'

    def generate_recommendations(self, analysis_data: List[Dict]) -> List[Dict]:
        """Generate privacy recommendations based on findings"""
        recommendations = []
        all_findings = []
        
        for data in analysis_data:
            all_findings.extend(data.get('findings', []))
        
        if not all_findings:
            return [{
                'title': 'Great Privacy Practices!',
                'description': 'No significant privacy risks detected. Keep up the good work!',
                'priority': 'low',
                'category': 'general'
            }]

        findings_by_type = self._group_findings_by_type(all_findings)
        
        # High-priority recommendations
        if 'email' in findings_by_type:
            recommendations.append({
                'title': 'Remove Email Addresses',
                'description': 'Email addresses were found in your profile. Consider removing them to prevent spam and phishing attacks.',
                'priority': 'high',
                'category': 'contact_info',
                'affectedCount': len(findings_by_type['email'])
            })

        if 'phone' in findings_by_type:
            recommendations.append({
                'title': 'Hide Phone Numbers',
                'description': 'Phone numbers are visible in your content. Remove or replace with alternative contact methods.',
                'priority': 'high',
                'category': 'contact_info',
                'affectedCount': len(findings_by_type['phone'])
            })

        if 'ssn' in findings_by_type:
            recommendations.append({
                'title': 'URGENT: Remove SSN Information',
                'description': 'Social Security Number patterns detected. Remove immediately to prevent identity theft.',
                'priority': 'high',
                'category': 'identity',
                'affectedCount': len(findings_by_type['ssn'])
            })

        if 'creditCard' in findings_by_type:
            recommendations.append({
                'title': 'URGENT: Remove Financial Information',
                'description': 'Credit card number patterns found. Delete immediately and monitor your accounts.',
                'priority': 'high',
                'category': 'financial',
                'affectedCount': len(findings_by_type['creditCard'])
            })

        # Medium-priority recommendations
        if 'address' in findings_by_type:
            recommendations.append({
                'title': 'Consider Hiding Home Address',
                'description': 'Your home address may be visible. Consider using general location instead of specific addresses.',
                'priority': 'medium',
                'category': 'location',
                'affectedCount': len(findings_by_type['address'])
            })

        if 'birthDate' in findings_by_type:
            recommendations.append({
                'title': 'Limit Birth Date Sharing',
                'description': 'Birth date information found. Consider sharing only month/day without the year.',
                'priority': 'medium',
                'category': 'personal',
                'affectedCount': len(findings_by_type['birthDate'])
            })

        if 'fullName' in findings_by_type:
            recommendations.append({
                'title': 'Review Full Name Visibility',
                'description': 'Full names detected in content. Consider using first name only or initials in public posts.',
                'priority': 'medium',
                'category': 'identity',
                'affectedCount': len(findings_by_type['fullName'])
            })

        # General recommendations based on overall risk
        risk_score = self.calculate_risk_score(analysis_data)
        
        if risk_score >= 60:
            recommendations.extend([
                {
                    'title': 'Enable Two-Factor Authentication',
                    'description': 'Your high privacy risk makes 2FA essential. Enable it on all social media accounts.',
                    'priority': 'high',
                    'category': 'security'
                },
                {
                    'title': 'Review Privacy Settings',
                    'description': 'Audit all privacy settings and limit who can see your posts and personal information.',
                    'priority': 'high',
                    'category': 'privacy'
                }
            ])

        if risk_score >= 40:
            recommendations.append({
                'title': 'Limit Personal Information Sharing',
                'description': 'Be more cautious about sharing personal details in posts and comments.',
                'priority': 'medium',
                'category': 'general'
            })

        # Platform-specific recommendations
        for platform_data in analysis_data:
            if platform_data.get('platform') == 'instagram' and platform_data.get('findings'):
                recommendations.append({
                    'title': 'Use Instagram Privacy Features',
                    'description': 'Make your account private and carefully review follower requests.',
                    'priority': 'medium',
                    'category': 'platform_specific'
                })

        # Low-priority general recommendations
        recommendations.extend([
            {
                'title': 'Regular Privacy Audits',
                'description': 'Review your social media privacy settings monthly and clean up old posts.',
                'priority': 'low',
                'category': 'maintenance'
            },
            {
                'title': 'Be Cautious with Location Sharing',
                'description': 'Avoid sharing real-time locations and consider disabling location services for social apps.',
                'priority': 'low',
                'category': 'location'
            }
        ])

        return self._sort_recommendations_by_priority(recommendations)

    def _group_findings_by_type(self, findings: List[Dict]) -> Dict[str, List[Dict]]:
        """Group findings by type"""
        groups = {}
        for finding in findings:
            pii_type = finding.get('type')
            if pii_type not in groups:
                groups[pii_type] = []
            groups[pii_type].append(finding)
        return groups

    def _sort_recommendations_by_priority(self, recommendations: List[Dict]) -> List[Dict]:
        """Sort recommendations by priority"""
        priority_order = {'high': 3, 'medium': 2, 'low': 1}
        return sorted(
            recommendations,
            key=lambda x: priority_order.get(x.get('priority', 'low'), 1),
            reverse=True
        )

    def get_analysis_summary(self, analysis_data: List[Dict]) -> Dict:
        """Get comprehensive analysis summary"""
        all_findings = []
        for data in analysis_data:
            all_findings.extend(data.get('findings', []))
        
        risk_score = self.calculate_risk_score(analysis_data)
        risk_level = self.get_risk_level(risk_score)
        
        severity_breakdown = {'high': 0, 'medium': 0, 'low': 0}
        type_breakdown = {}
        
        for finding in all_findings:
            severity = finding.get('severity', 'low')
            pii_type = finding.get('type', 'unknown')
            
            severity_breakdown[severity] = severity_breakdown.get(severity, 0) + 1
            type_breakdown[pii_type] = type_breakdown.get(pii_type, 0) + 1

        return {
            'riskScore': risk_score,
            'riskLevel': risk_level,
            'totalFindings': len(all_findings),
            'severityBreakdown': severity_breakdown,
            'typeBreakdown': type_breakdown,
            'platforms': [
                {
                    'platform': data.get('platform', 'unknown'),
                    'findingCount': len(data.get('findings', [])),
                    'riskContribution': self._calculate_platform_risk_contribution(data, analysis_data)
                }
                for data in analysis_data
            ],
            'analysisTimestamp': time.time()
        }

    def _calculate_platform_risk_contribution(self, platform_data: Dict, all_analysis_data: List[Dict]) -> int:
        """Calculate how much a platform contributes to overall risk"""
        platform_score = self.calculate_risk_score([platform_data])
        total_score = self.calculate_risk_score(all_analysis_data)
        
        if total_score == 0:
            return 0
        
        return round((platform_score / total_score) * 100)
