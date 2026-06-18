from google import genai

client = genai.Client(api_key="AQ.Ab8RN6IloeeX_N4qTn8COiUyE8BYxadpAjImMXosnKMegmmEQw")

for model in client.models.list():
    print(model.name)