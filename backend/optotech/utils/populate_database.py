import psycopg2
import random
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from faker import Faker  # Biblioteca para gerar dados falsos
fake = Faker()

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Conexão com o banco de dados
conn = psycopg2.connect(
    dbname=os.environ.get("DB_NAME"), 
    user=os.environ.get("DB_USER"), 
    password=os.environ.get("DB_PASSWORD"), 
    host=os.environ.get("DB_HOST")
)
conn.autocommit = True
# Cria um cursor para executar operações no banco de dados
cur = conn.cursor()

# Número de usuários a serem criados
num_users = 0
max_atendimentos = 5
num_patients = 100

acuidades = ['20/200', '20/100', '20/70', '20/50', '20/40', '20/30', '20/25', '20/20', '20/15', '20/13', '20/10']

# Criar e inserir usuários
for _ in range(num_users):
    username = fake.user_name()  # Gera um nome de usuário
    user_email = fake.email()
    user_password = fake.password()
    dpi = random.randint(80, 200)
    sql_user = '''
        INSERT INTO usuarios ("user", "email", "password", "dpi") 
        VALUES (%s, %s, %s, %s) RETURNING id;
    '''

    cur.execute(sql_user, (username, user_email, user_password, dpi))

# Obter IDs dos usuários criados
cur.execute("SELECT id FROM usuarios")
id_usuarios = [row[0] for row in cur.fetchall()]

def random_date():
    start_date = datetime(2020, 1, 1)
    end_date = datetime.now()
    time_between_dates = end_date - start_date
    random_number_of_days = random.randrange(time_between_dates.days)
    random_date = start_date + timedelta(days=random_number_of_days)
    random_hour = random.randint(0, 23)
    random_minute = random.randint(0, 59)
    return random_date.replace(hour=random_hour, minute=random_minute)


for _ in range(num_patients):
    # Gerando dados aleatórios
    id_usuario_aleatorio = random.choice(id_usuarios)
    nome_paciente = fake.first_name() + " " + fake.last_name()  # Nome e sobrenome aleatórios
    ano = random.randint(1950, 2010)
    mes = random.randint(1, 12)
    dia = random.randint(1, 28)  # Para simplificar, evita verificar o último dia de cada mês
    data_nascimento = f"{ano}-{mes:02d}-{dia:02d}"
    codigo = str(random.randint(1000, 9999))
    ativo = random.choice([True, False])  # Valor booleano aleatório

    # Comando SQL para inserir o novo paciente e retornar o ID gerado
    sql_paciente = """
        INSERT INTO pacientes (nome, data_nascimento, codigo, ativo) 
        VALUES (%s, %s, %s, %s) RETURNING id;
    """

    cur.execute(sql_paciente, (nome_paciente, data_nascimento, codigo, ativo))
    id_paciente = cur.fetchone()[0]

    # Comando SQL para inserir o registro na tabela user_pacientes
    sql_user_pacientes = """
        INSERT INTO pacientes_usuarios (user_id, paciente_id) 
        VALUES (%s, %s) RETURNING id;
    """
    cur.execute(sql_user_pacientes, (id_usuario_aleatorio, id_paciente))
    user_patient_id = cur.fetchone()[0]

    num_atendimentos = random.randint(0, max_atendimentos)
    for _ in range(num_atendimentos):
        acuidade_1 = random.choice(acuidades)
        acuidade_2 = random.choice(acuidades)
        acuidade = f"{acuidade_1}.{acuidade_2}"
        data_atendimento = random_date()

        sql_appointments = """
            INSERT INTO atendimentos (paciente_usuario_id, acuidade, data_atendimento) 
            VALUES (%s, %s, %s);
        """
        cur.execute(sql_appointments, (user_patient_id, acuidade, data_atendimento))


# Fecha o cursor e a conexão
cur.close()
conn.close()
print("SUCESSO")