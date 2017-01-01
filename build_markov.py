prof_file = open('prof.txt', 'r')
uni_file = open('schools.txt', 'r+')
adj_file = open('adj.txt', 'w')

ENTRY_COLUMNS = ['id', 'name', 'university', 'phd', 'gender', 'type', 'joinyear', 'field']

class Entry(object):

  def __init__(self, entry_string):
    values = entry_string.split(',')
    if len(values) != 8:
      raise Exception('entry error')
    entry_dict = dict(zip(ENTRY_COLUMNS, values))
    self.__dict__.update(entry_dict)

prof_entries = []
for prof in prof_file:
  if '#' in prof:
    continue

  prof = prof.rstrip()
  prof_entry = Entry(prof)
  prof_entries.append(prof_entry)


def generate_schools_list():
  schools = set()
  top_schools = set()
  for prof_entry in prof_entries:
    if prof_entry.university:
      schools.add(prof_entry.university)
      top_schools.add(prof_entry.university)
    if prof_entry.phd:
      schools.add(prof_entry.phd)

  top_schools_list = list(top_schools)

  schools_info = ['%d,%s' % (x, top_schools_list[x]) for x in range(len(top_schools_list))]

  output = '\n'.join(schools_info)
  uni_file.write(output)

# generate_schools_list()

def generate_graph():
  top_school_map = dict()
  top_schools = []
  for school_string in uni_file:
    values = school_string.rstrip().split(',')
    top_school_map[values[1]] = int(values[0])
    top_schools.append(values[1])

  num_schools = len(top_school_map)
  adjacency = [[0 for _ in top_school_map] for _ in top_school_map]

  for prof_entry in prof_entries:
    if prof_entry.phd in top_school_map:
      # add edge weight from phd towards uni
      adjacency[top_school_map[prof_entry.phd]][top_school_map[prof_entry.university]] += 1

  output = ','.join(top_schools) + '\n'
  output += '\n'.join([','.join([str(x) for x in row]) for row in adjacency])
  adj_file.write(output)

generate_graph()