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
            # High-risk indicators
            'email': 15,
            'phone': 15,
            'ipAddress': 18,
            'childInfo': 20,
            'medicalInfo': 18,
            
            # Medium-risk indicators
            'address': 12,
            'zipCode': 10,
            'birthDate': 10,
            'school': 8,
            'workplace': 8,
            'location': 7,
            'travelPlans': 9,
            'financialInfo': 12,
            'vehicleInfo': 6,
            
            # Low-risk indicators
            'age': 3,
            'familyMember': 4,
            'dailyRoutine': 5,
            'petInfo': 4,
            'relationship': 3
        }

        self.platform_multipliers = {
            'instagram': 1.2,
            'facebook': 1.1,
            'twitter': 1.0,
            'linkedin': 0.9,
            'reddit': 1.3
        }

    def calculate_risk_score(self, analysis_data: List[Dict]) -> int:
        """calculates overall risk score from analysis data"""
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
        """gets risk level based on score"""
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
        """generates privacy recommendations based on findings"""
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
        
        # high-priority recommendations
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

        if 'ipAddress' in findings_by_type:
            recommendations.append({
                'title': 'URGENT: Remove IP Address',
                'description': 'IP address detected in your content. Remove immediately to prevent tracking and targeted attacks.',
                'priority': 'high',
                'category': 'technical',
                'affectedCount': len(findings_by_type['ipAddress'])
            })

        if 'childInfo' in findings_by_type:
            recommendations.append({
                'title': 'URGENT: Remove Child Identifying Information',
                'description': 'Information about children detected. Remove immediately to protect their privacy and safety.',
                'priority': 'high',
                'category': 'identity',
                'affectedCount': len(findings_by_type['childInfo'])
            })

        if 'medicalInfo' in findings_by_type:
            recommendations.append({
                'title': 'Remove Medical Information',
                'description': 'Medical or health information detected. Consider removing to protect your privacy and prevent discrimination.',
                'priority': 'high',
                'category': 'health',
                'affectedCount': len(findings_by_type['medicalInfo'])
            })

        # medium-priority recommendations
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

        if 'school' in findings_by_type:
            recommendations.append({
                'title': 'Remove School Information',
                'description': 'School or university information detected. This can be used for social engineering or stalking.',
                'priority': 'medium',
                'category': 'identity',
                'affectedCount': len(findings_by_type['school'])
            })

        if 'workplace' in findings_by_type:
            recommendations.append({
                'title': 'Limit Workplace Details',
                'description': 'Workplace information found. Consider removing or being less specific about your employer.',
                'priority': 'medium',
                'category': 'identity',
                'affectedCount': len(findings_by_type['workplace'])
            })

        if 'travelPlans' in findings_by_type:
            recommendations.append({
                'title': 'Remove Travel Plans',
                'description': 'Travel or absence information detected. Never post about being away from home publicly.',
                'priority': 'medium',
                'category': 'safety',
                'affectedCount': len(findings_by_type['travelPlans'])
            })

        if 'financialInfo' in findings_by_type:
            recommendations.append({
                'title': 'Remove Financial Information',
                'description': 'Salary or income information detected. Avoid sharing financial details publicly.',
                'priority': 'medium',
                'category': 'financial',
                'affectedCount': len(findings_by_type['financialInfo'])
            })

        if 'zipCode' in findings_by_type:
            recommendations.append({
                'title': 'Hide Zip Code',
                'description': 'Zip code detected. Combined with other info, this can reveal your exact location.',
                'priority': 'medium',
                'category': 'location',
                'affectedCount': len(findings_by_type['zipCode'])
            })

        if 'vehicleInfo' in findings_by_type:
            recommendations.append({
                'title': 'Limit Vehicle Information',
                'description': 'Vehicle details found. This information can be used to identify or track you.',
                'priority': 'medium',
                'category': 'personal',
                'affectedCount': len(findings_by_type['vehicleInfo'])
            })

        # low-priority recommendations
        if 'familyMember' in findings_by_type:
            recommendations.append({
                'title': 'Limit Family Member Names',
                'description': 'Family member names detected. These are commonly used in security questions.',
                'priority': 'low',
                'category': 'personal',
                'affectedCount': len(findings_by_type['familyMember'])
            })

        if 'petInfo' in findings_by_type:
            recommendations.append({
                'title': 'Hide Pet Names',
                'description': 'Pet names detected. These are frequently used as security question answers.',
                'priority': 'low',
                'category': 'personal',
                'affectedCount': len(findings_by_type['petInfo'])
            })

        if 'dailyRoutine' in findings_by_type:
            recommendations.append({
                'title': 'Be Careful with Routine Information',
                'description': 'Daily routine patterns detected. Avoid sharing predictable schedules publicly.',
                'priority': 'low',
                'category': 'safety',
                'affectedCount': len(findings_by_type['dailyRoutine'])
            })

        # general recommendations based on overall risk
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

        # platform-specific recommendations
        for platform_data in analysis_data:
            if platform_data.get('platform') == 'instagram' and platform_data.get('findings'):
                recommendations.append({
                    'title': 'Use Instagram Privacy Features',
                    'description': 'Make your account private and carefully review follower requests.',
                    'priority': 'medium',
                    'category': 'platform_specific'
                })
            elif platform_data.get('platform') == 'facebook' and platform_data.get('findings'):
                recommendations.append({
                    'title': 'Review Facebook Privacy Settings',
                    'description': 'Check your Facebook privacy settings and limit who can see your posts and personal information.',
                    'priority': 'medium',
                    'category': 'platform_specific'
                })
                recommendations.append({
                    'title': 'Audit Facebook Posts History',
                    'description': 'Review and delete old Facebook posts that may contain sensitive information.',
                    'priority': 'medium',
                    'category': 'platform_specific'
                })

        # low-priority general recommendations
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
        """group findings by type"""
        groups = {}
        for finding in findings:
            pii_type = finding.get('type')
            if pii_type not in groups:
                groups[pii_type] = []
            groups[pii_type].append(finding)
        return groups

    def _sort_recommendations_by_priority(self, recommendations: List[Dict]) -> List[Dict]:
        """sorts recommendations by priority"""
        priority_order = {'high': 3, 'medium': 2, 'low': 1}
        return sorted(
            recommendations,
            key=lambda x: priority_order.get(x.get('priority', 'low'), 1),
            reverse=True
        )

    def get_analysis_summary(self, analysis_data: List[Dict]) -> Dict:
        """gets comprehensive analysis summary"""
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
        """calculates how much a platform contributes to overall risk"""
        platform_score = self.calculate_risk_score([platform_data])
        total_score = self.calculate_risk_score(all_analysis_data)
        
        if total_score == 0:
            return 0
        
        return round((platform_score / total_score) * 100)



