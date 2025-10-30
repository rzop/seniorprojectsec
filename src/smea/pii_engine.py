import re
from typing import Dict, List, Any, Union

class PIIEngine:
    def __init__(self):
        self.patterns = {
            # high-risk patterns
            'email': {
                'regex': re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'),
                'severity': 'high',
                'description': 'Email address detected'
            },
            'phone': {
                'regex': re.compile(r'(?:(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})|(?:(?:call|text|reach)\s*(?:me\s*)?(?:at\s*)?[\d\s\-\(\)]{10,}))', re.IGNORECASE),
                'severity': 'high',
                'description': 'Phone number or contact information detected'
            },
            'ipAddress': {
                'regex': re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b'),
                'severity': 'high',
                'description': 'IP address detected'
            },
            'childInfo': {
                'regex': re.compile(r'\b(?:my\s+(?:son|daughter|kid|child|baby)(?:\'?s?)?\s+(?:name\s+is\s+)?[A-Z][a-z]+|[A-Z][a-z]+\s+is\s+my\s+(?:son|daughter|kid|child))\b'),
                'severity': 'high',
                'description': 'Child identification information detected'
            },
            'medicalInfo': {
                'regex': re.compile(r'\b(?:diagnosed with|taking medication|prescription for|medical condition|therapy for|doctor said|hospital for)\s+[a-z]{4,}\b', re.IGNORECASE),
                'severity': 'high',
                'description': 'Medical information detected'
            },
            
            # medium-risk patterns
            'address': {
                'regex': re.compile(r'\b\d+\s+[A-Za-z0-9\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct|Place|Pl|Highway|Hwy)\b', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Street address detected'
            },
            'zipCode': {
                'regex': re.compile(r'\b(?:zip\s*code?\s*:?\s*)?(\d{5}(?:-\d{4})?)\b', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Zip code detected'
            },
            'birthDate': {
                'regex': re.compile(r'\b(?:born|birthday|b-?day|turning|turned|dob|date of birth|born on)\s*:?\s*(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Birth date information detected'
            },
            'school': {
                'regex': re.compile(r'\b(?:go(?:es|ing)?\s+to|attend(?:s|ing)?|student\s+at|studying\s+at|enrolled\s+at|graduated\s+from)\s+([A-Z][A-Za-z\s]+(?:School|College|University|Academy|Institute))', re.IGNORECASE),
                'severity': 'medium',
                'description': 'School or university information detected'
            },
            'workplace': {
                'regex': re.compile(r'\b(?:work(?:s|ing)?\s+(?:at|for)|employed\s+(?:at|by|with)|my\s+job\s+at|position\s+at|hired\s+at)\s+([A-Z][A-Za-z\s&,\.]+)', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Workplace information detected'
            },
            'location': {
                'regex': re.compile(r'\b(?:live\s+(?:in|at)|from|located\s+in|based\s+in|moving\s+to|resident\s+of)\s+([A-Z][a-z]+(?:\s*,\s*[A-Z][a-z]+)*)\b', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Location information detected'
            },
            'travelPlans': {
                'regex': re.compile(r'\b(?:going\s+to|traveling\s+to|vacation\s+in|trip\s+to|visiting|leaving\s+for|heading\s+to|away\s+(?:until|till|from))\s+[A-Z][a-z]+', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Travel plans or absence information detected'
            },
            'financialInfo': {
                'regex': re.compile(r'\b(?:make|making|earn|earning|salary|paid|income)\s+(?:about\s+)?[$€£]\s*[\d,]+(?:\s*k)?(?:\s+(?:per|a)\s+(?:year|month|hour))?\b', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Financial information detected'
            },
            'vehicleInfo': {
                'regex': re.compile(r'\b(?:my\s+car|my\s+vehicle|driving\s+a)\s+(?:\d{4}\s+)?[A-Z][a-z]+\s+[A-Z][a-z]+\b', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Vehicle information detected'
            },
            
            # low-risk patterns  
            'age': {
                'regex': re.compile(r'\b(?:I\'?m|I\s+am|age\s+is?|years?\s+old|turned|turning)\s+\d{1,2}\b', re.IGNORECASE),
                'severity': 'low',
                'description': 'Age information detected'
            },
            'familyMember': {
                'regex': re.compile(r'\b(?:my\s+(?:mom|dad|mother|father|sister|brother|husband|wife|grandma|grandpa|aunt|uncle))\s+[A-Z][a-z]+\b'),
                'severity': 'low',
                'description': 'Family member name detected'
            },
            'dailyRoutine': {
                'regex': re.compile(r'\b(?:every|each)\s+(?:morning|day|night|evening)\s+(?:at|around)\s+\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?\b', re.IGNORECASE),
                'severity': 'low',
                'description': 'Daily routine pattern detected'
            },
            'petInfo': {
                'regex': re.compile(r'\b(?:my\s+(?:dog|cat|pet)(?:\'?s?)?\s+name\s+is\s+[A-Z][a-z]+)\b'),
                'severity': 'low',
                'description': 'Pet name detected (common security question answer)'
            },
            'relationship': {
                'regex': re.compile(r'\b(?:dating|married\s+to|engaged\s+to|in\s+a\s+relationship\s+with)\s+[A-Z][a-z]+\b', re.IGNORECASE),
                'severity': 'low',
                'description': 'Relationship information detected'
            }
        }

    def scan_for_pii(self, text_data: Union[str, Dict]) -> List[Dict]:
        """scans text data for PII patterns"""
        findings = []
        text_sources = self._normalize_text_data(text_data)
        
        for location, texts in text_sources.items():
            if not isinstance(texts, list):
                texts = [texts]
            
            for index, text in enumerate(texts):
                if isinstance(text, str) and text.strip():
                    location_findings = self._scan_text(text, location, index)
                    findings.extend(location_findings)
        
        return self._deduplicate_findings(findings)

    def _normalize_text_data(self, text_data: Union[str, Dict]) -> Dict:
        """normalizes different input formats"""
        if isinstance(text_data, str):
            return {'content': [text_data]}
        
        if isinstance(text_data, dict):
            normalized = {}
            if 'bio' in text_data:
                normalized['bio'] = [text_data['bio']]
            if 'posts' in text_data:
                normalized['posts'] = text_data['posts']
            if 'comments' in text_data:
                normalized['comments'] = text_data['comments']
            if 'allText' in text_data:
                normalized['allText'] = [text_data['allText']]
            
            for key, value in text_data.items():
                if isinstance(value, str):
                    normalized[key] = [value]
                elif isinstance(value, list):
                    normalized[key] = value
            
            return normalized
        
        return {'content': []}

    def _scan_text(self, text: str, location: str, index: int = 0) -> List[Dict]:
        """scans individual text for PII patterns"""
        findings = []
        
        for pii_type, pattern_info in self.patterns.items():
            matches = pattern_info['regex'].findall(text)
            
            if matches:
                for match in matches:
                    if isinstance(match, tuple):
                        match = ''.join(match)
                    
                    context = self._get_context(text, str(match))
                    
                    findings.append({
                        'type': pii_type,
                        'severity': pattern_info['severity'],
                        'description': pattern_info['description'],
                        'match': str(match).strip(),
                        'context': context,
                        'location': f"{location}[{index}]" if index > 0 else location,
                        'confidence': self._calculate_confidence(pii_type, str(match), context)
                    })
        
        return findings

    def _get_context(self, text: str, match: str, context_length: int = 50) -> str:
        """gets surrounding context for a match"""
        try:
            match_index = text.lower().find(match.lower())
            if match_index == -1:
                return text[:100] + "..." if len(text) > 100 else text
            
            start = max(0, match_index - context_length)
            end = min(len(text), match_index + len(match) + context_length)
            
            context = text[start:end]
            
            if start > 0:
                context = '...' + context
            if end < len(text):
                context = context + '...'
            
            return context
        except Exception:
            return text[:100] + "..." if len(text) > 100 else text

    def _calculate_confidence(self, pii_type: str, match: str, context: str) -> float:
        """calculates confidence score for a PII finding"""
        confidence = 0.7
        
        # High-risk patterns
        if pii_type == 'email':
            confidence = 0.95 if self._validate_email(match) else 0.6
        elif pii_type == 'phone':
            confidence = 0.9 if self._validate_phone(match) else 0.7
        elif pii_type == 'ipAddress':
            confidence = 0.85
        elif pii_type == 'childInfo':
            confidence = 0.9
        elif pii_type == 'medicalInfo':
            confidence = 0.85
            
        # Medium-risk patterns
        elif pii_type == 'address':
            confidence = 0.8
        elif pii_type == 'zipCode':
            confidence = 0.85
        elif pii_type == 'birthDate':
            confidence = 0.85
        elif pii_type == 'school':
            confidence = 0.8
        elif pii_type == 'workplace':
            confidence = 0.8
        elif pii_type == 'location':
            confidence = 0.75
        elif pii_type == 'travelPlans':
            confidence = 0.8
        elif pii_type == 'financialInfo':
            confidence = 0.85
        elif pii_type == 'vehicleInfo':
            confidence = 0.7
            
        # Low-risk patterns
        elif pii_type == 'age':
            confidence = 0.75
        elif pii_type == 'familyMember':
            confidence = 0.7
        elif pii_type == 'dailyRoutine':
            confidence = 0.7
        elif pii_type == 'petInfo':
            confidence = 0.75
        elif pii_type == 'relationship':
            confidence = 0.7
        else:
            confidence = 0.6
        
        # Reduce confidence for test/fake data
        context_lower = context.lower()
        if any(word in context_lower for word in ['fake', 'example', 'test', 'demo', 'sample']):
            confidence *= 0.3
        
        return round(confidence, 2)

    def _validate_email(self, email: str) -> bool:
        email_regex = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
        return bool(email_regex.match(email))

    def _validate_phone(self, phone: str) -> bool:
        clean_phone = re.sub(r'\D', '', phone)
        return len(clean_phone) in [10, 11]

    def _validate_credit_card(self, card_number: str) -> bool:
        clean_number = re.sub(r'\D', '', card_number)
        return 13 <= len(clean_number) <= 19

    def _validate_name(self, name: str) -> bool:
        parts = name.strip().split()
        return len(parts) >= 2 and all(len(part) > 1 for part in parts)

    def _deduplicate_findings(self, findings: List[Dict]) -> List[Dict]:
        """removes duplicate findings"""
        seen = set()
        unique_findings = []
        
        for finding in findings:
            key = f"{finding['type']}-{finding['match']}-{finding['location']}"
            if key not in seen:
                seen.add(key)
                unique_findings.append(finding)
        
        return unique_findings

    def get_summary(self, findings: List[Dict]) -> Dict:
        """gets summary statistics for findings"""
        summary = {
            'total': len(findings),
            'high': 0,
            'medium': 0,
            'low': 0,
            'types': {}
        }

        for finding in findings:
            severity = finding.get('severity', 'low')
            pii_type = finding.get('type', 'unknown')
            
            summary[severity] = summary.get(severity, 0) + 1
            summary['types'][pii_type] = summary['types'].get(pii_type, 0) + 1

        return summary




