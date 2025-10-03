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
                'regex': re.compile(r'(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'),
                'severity': 'high',
                'description': 'Phone number detected'
            },
            'ssn': {
                'regex': re.compile(r'\b\d{3}-?\d{2}-?\d{4}\b'),
                'severity': 'high',
                'description': 'Social Security Number pattern detected'
            },
            'creditCard': {
                'regex': re.compile(r'\b(?:\d{4}[-\s]?){3}\d{4}\b'),
                'severity': 'high',
                'description': 'Credit card number pattern detected'
            },
            
            # medium-risk patterns
            'address': {
                'regex': re.compile(r'\b\d+\s+[A-Za-z0-9\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct|Place|Pl)\b', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Street address detected'
            },
            'birthDate': {
                'regex': re.compile(r'\b(?:born|birthday|b-day|dob|date of birth).{0,20}(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Birth date information detected'
            },
            'fullName': {
                'regex': re.compile(r'\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b'),
                'severity': 'medium',
                'description': 'Full name pattern detected'
            },
            'location': {
                'regex': re.compile(r'\b(?:live in|from|located in|based in)\s+[A-Z][a-z]+(?:\s*,\s*[A-Z][a-z]+)*\b', re.IGNORECASE),
                'severity': 'medium',
                'description': 'Location information detected'
            },
            
            # low-risk patterns
            'age': {
                'regex': re.compile(r'\b(?:age|years old|i\'m|i am)\s*(?:is\s*)?\d{1,2}\b', re.IGNORECASE),
                'severity': 'low',
                'description': 'Age information detected'
            },
            'personalInfo': {
                'regex': re.compile(r'\b(?:my|i\'m|i am|personal|private|confidential)\b', re.IGNORECASE),
                'severity': 'low',
                'description': 'Personal information keywords detected'
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
        
        if pii_type == 'email':
            confidence = 0.95 if self._validate_email(match) else 0.6
        elif pii_type == 'phone':
            confidence = 0.9 if self._validate_phone(match) else 0.7
        elif pii_type == 'ssn':
            confidence = 0.8
        elif pii_type == 'creditCard':
            confidence = 0.85 if self._validate_credit_card(match) else 0.6
        elif pii_type == 'address':
            confidence = 0.75
        elif pii_type == 'birthDate':
            confidence = 0.8
        elif pii_type == 'fullName':
            confidence = 0.7 if self._validate_name(match) else 0.5
        else:
            confidence = 0.6
        
        context_lower = context.lower()
        if any(word in context_lower for word in ['fake', 'example', 'test', 'demo']):
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


