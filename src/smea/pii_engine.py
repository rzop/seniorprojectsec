import re
from typing import Dict, List, Any, Union
from concurrent.futures import ThreadPoolExecutor, as_completed

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
                'regex': re.compile(r'(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'),
                'severity': 'high',
                'description': 'Phone number or contact information detected'
            },
            'ipAddress': {
                'regex': re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b'),
                'severity': 'high',
                'description': 'IP address detected'
            },
            'childInfo': {
                'regex': re.compile(r'\bmy\s+(?:son|daughter|kid|child|baby)\s+[A-Z][a-z]+\b'),
                'severity': 'high',
                'description': 'Child identification information detected'
            },
            'medicalInfo': {
                'regex': re.compile(r'\b(?:diagnosed|medication|prescription|medical condition|therapy|hospital)\s+\w+', re.IGNORECASE),
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
                'regex': re.compile(r'\b(?:birthday|born)\s*:?\s*\d{1,2}[-/]\d{1,2}[-/]\d{2,4}', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Birth date information detected'
            },
            'school': {
                'regex': re.compile(r'\b(?:attend|student at|studying at)\s+\w+\s+(?:School|College|University)', re.IGNORECASE),
                'severity': 'medium',
                'description': 'School or university information detected'
            },
            'workplace': {
                'regex': re.compile(r'\bwork(?:s|ing)?\s+(?:at|for)\s+[A-Z]\w+', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Workplace information detected'
            },
            'location': {
                'regex': re.compile(r'\b(?:live in|from|based in)\s+[A-Z]\w+', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Location information detected'
            },
            'travelPlans': {
                'regex': re.compile(r'\b(?:going to|traveling to|vacation in|trip to)\s+[A-Z]\w+', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Travel plans or absence information detected'
            },
            'financialInfo': {
                'regex': re.compile(r'\b(?:salary|income|earn)\s+[$€£]\s*[\d,]+', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Financial information detected'
            },
            'vehicleInfo': {
                'regex': re.compile(r'\bmy\s+(?:car|vehicle)\s+\d{4}\s+\w+', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Vehicle information detected'
            },
            
            # low-risk patterns  
            'age': {
                'regex': re.compile(r'\b(?:I\'?m|years old)\s+\d{1,2}\b', re.IGNORECASE),
                'severity': 'low',
                'description': 'Age information detected'
            },
            'familyMember': {
                'regex': re.compile(r'\bmy\s+(?:mom|dad|mother|father|sister|brother)\s+[A-Z]\w+\b'),
                'severity': 'low',
                'description': 'Family member name detected'
            },
            'dailyRoutine': {
                'regex': re.compile(r'\bevery\s+(?:morning|day|night)\s+at\s+\d{1,2}', re.IGNORECASE),
                'severity': 'low',
                'description': 'Daily routine pattern detected'
            },
            'petInfo': {
                'regex': re.compile(r'\bmy\s+(?:dog|cat|pet)\s+\w+\b', re.IGNORECASE),
                'severity': 'low',
                'description': 'Pet name detected (common security question answer)'
            },
            'relationship': {
                'regex': re.compile(r'\b(?:dating|married to)\s+[A-Z]\w+\b', re.IGNORECASE),
                'severity': 'low',
                'description': 'Relationship information detected'
            }
        }

    def scan_for_pii(self, text_data: Union[str, Dict]) -> List[Dict]:
        """scans text data for PII patterns with parallel processing"""
        findings = []
        text_sources = self._normalize_text_data(text_data)
        
        # Prepare all scan tasks
        scan_tasks = []
        for location, texts in text_sources.items():
            if not isinstance(texts, list):
                texts = [texts]
            
            for index, text in enumerate(texts):
                if isinstance(text, str) and text.strip():
                    scan_tasks.append((text, location, index))
        
        # Process in parallel for speed (max 8 workers for faster processing)
        if len(scan_tasks) > 5:
            with ThreadPoolExecutor(max_workers=8) as executor:
                future_to_task = {
                    executor.submit(self._scan_text, text, location, index): (text, location, index)
                    for text, location, index in scan_tasks
                }
                
                for future in as_completed(future_to_task):
                    try:
                        location_findings = future.result()
                        findings.extend(location_findings)
                    except Exception as e:
                        # Skip failed scans but continue processing
                        pass
        else:
            # For small datasets, sequential is faster (no thread overhead)
            for text, location, index in scan_tasks:
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

    def _get_context(self, text: str, match: str, context_length: int = 30) -> str:
        """gets surrounding context for a match"""
        try:
            match_index = text.lower().find(match.lower())
            if match_index == -1:
                return text[:60] + "..." if len(text) > 60 else text
            
            start = max(0, match_index - context_length)
            end = min(len(text), match_index + len(match) + context_length)
            
            context = text[start:end]
            
            if start > 0:
                context = '...' + context
            if end < len(text):
                context = context + '...'
            
            return context
        except Exception:
            return text[:60] + "..." if len(text) > 60 else text

    def _calculate_confidence(self, pii_type: str, match: str, context: str) -> float:
        """calculates confidence score for a PII finding"""
        # Fast lookup table for confidence scores
        confidence_map = {
            'email': 0.95, 'phone': 0.9, 'ipAddress': 0.85,
            'childInfo': 0.9, 'medicalInfo': 0.85,
            'address': 0.8, 'zipCode': 0.85, 'birthDate': 0.85,
            'school': 0.8, 'workplace': 0.8, 'location': 0.75,
            'travelPlans': 0.8, 'financialInfo': 0.85, 'vehicleInfo': 0.7,
            'age': 0.75, 'familyMember': 0.7, 'dailyRoutine': 0.7,
            'petInfo': 0.75, 'relationship': 0.7
        }
        
        confidence = confidence_map.get(pii_type, 0.7)
        
        # Quick check for test/fake data (only if needed)
        if 'fake' in context.lower() or 'test' in context.lower():
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




