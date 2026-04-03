import time

def symptom_checker(symptoms: str) -> str:
    """
    Mock integration for OpenAI symptom checking.
    In production, this would call openai.ChatCompletion.create()
    """
    time.sleep(1) # simulate network call
    
    symptoms = symptoms.lower()
    if 'headache' in symptoms or 'fever' in symptoms:
        return "Based on your symptoms (headache/fever), it is possible you are experiencing a viral infection or flu. If the fever is high (above 103°F) or lasts more than 3 days, please see a doctor immediately."
    elif 'chest' in symptoms or 'pain' in symptoms:
        return "Chest pain can be a sign of a serious medical emergency, such as a heart attack. Please seek immediate medical attention or call emergency services if the pain is severe or radiating."
    
    return "I have noted your symptoms. Please monitor them closely. If they worsen or persist, consider consulting a healthcare professional."
