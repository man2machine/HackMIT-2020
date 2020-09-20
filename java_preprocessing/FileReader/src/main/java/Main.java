import java.io.File;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univocity.parsers.csv.CsvParserSettings;
import com.univocity.parsers.csv.CsvRoutines;
import org.iq80.leveldb.*;
import sun.security.util.ArrayUtil;

import static org.iq80.leveldb.impl.Iq80DBFactory.*;

import java.io.*;
import java.util.Set;

public class Main {
    private static List<Record> listMARecords = new ArrayList<Record>();
    private static Instant startTime = Instant.now();
    private static Integer counter = 0;
    private static DB hashcodeMap;
    private static Integer counterMapping = 0;
    private static Instant startTimeMapping;
    private static List<LocatedRecord> listLocatedRecords = new ArrayList<LocatedRecord>();
    private static Integer counterMatch = 0;
    private static Instant startTimeMatching;
    private static Set<String> categories = new HashSet<String>();


    public static void main(String[] args) throws IOException {

        // Read hourly statistics csv files and populate the listMARecords
        readRecordsFile("C:/Users/vchu1/Downloads/patterns-part1.csv/patterns-part1.csv");
        readRecordsFile("C:/Users/vchu1/Downloads/patterns-part2.csv/patterns-part2.csv");
        readRecordsFile("C:/Users/vchu1/Downloads/patterns-part3.csv/patterns-part3.csv");
        readRecordsFile("C:/Users/vchu1/Downloads/patterns-part4.csv/patterns-part4.csv");

        System.out.println("Finished processing the records files");

        // Open a levelDb to store key: hashcode value: location information
        Options options = new Options();
        hashcodeMap = factory.open(new File("C:/Users/vchu1/Documents/HackMITLevelDB"), options);
        startTimeMapping = Instant.now();

        // Load the csv files for location into the levelDb
        parseMap("C:/Users/vchu1/Downloads/Core-USA-Sep-CORE_POI-2020_08-2020-09-08/core_poi-part1.csv/core_poi-part1.csv");
        parseMap("C:/Users/vchu1/Downloads/Core-USA-Sep-CORE_POI-2020_08-2020-09-08/core_poi-part2.csv/core_poi-part2.csv");
        parseMap("C:/Users/vchu1/Downloads/Core-USA-Sep-CORE_POI-2020_08-2020-09-08/core_poi-part3.csv/core_poi-part3.csv");
        parseMap("C:/Users/vchu1/Downloads/Core-USA-Sep-CORE_POI-2020_08-2020-09-08/core_poi-part4.csv/core_poi-part4.csv");
        parseMap("C:/Users/vchu1/Downloads/Core-USA-Sep-CORE_POI-2020_08-2020-09-08/core_poi-part5.csv/core_poi-part5.csv");

        System.out.println("Finished parsing the mappings");

        // Match the parsed records with the associated location information
        startTimeMatching = Instant.now();
        matchRecordMapping();

        ObjectMapper objectMapper = new ObjectMapper();

        for(LocatedRecord locatedRecord : listLocatedRecords) {

            Boolean valid = true;
            String hourRecords = locatedRecord.getRecord().getVisits_by_each_hour();
            if(hourRecords.length() > 168) {
                String[] listHourStrings = hourRecords.substring(1, hourRecords.length()-1).split(",");
                String openHours = locatedRecord.getMapping().getOpen_hours();
                System.out.println(openHours);
            }

        }

//         Output the results into a list of JSON in a text file.
        File fout = new File("C:/Users/vchu1/Documents/JSON1.txt");
        FileOutputStream fos = new FileOutputStream(fout);

        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(fos));
        bw.write("[");
        bw.newLine();
        Integer index = 0;
        for (LocatedRecord locatedRecord : listLocatedRecords) {
            if (index == listLocatedRecords.size() - 1) {
                bw.write(objectMapper.writeValueAsString(locatedRecord));
            } else {
                bw.write(objectMapper.writeValueAsString(locatedRecord) + ",");
            }
            bw.newLine();
            index++;
        }
        bw.write("]");
        bw.newLine();
        bw.close();

        System.out.println(categories);
        System.out.println(categories.size());
    }

    public static void readRecordsFile(String path) {

        File input = new File(path);

        CsvParserSettings parserSettings = new CsvParserSettings();
        parserSettings.setMaxCharsPerColumn(1000000);
        //...configure the parser

        // You can also use TSV and Fixed-width routines
        CsvRoutines routines = new CsvRoutines(parserSettings);
        for (Record record : routines.iterate(Record.class, input, "UTF-8")) {
            try {
                counter++;

                if (record.getRegion().equals("MA")) {
                    listMARecords.add(record);
                }

                if (counter % 10000 == 0) {
                    Instant current = Instant.now();

                    System.out.println("Processed " + counter + " elements.");
                    System.out.println("Out of those MA: " + listMARecords.size());
                    System.out.println("Time elapsed in seconds: " + Duration.between(startTime, current).getSeconds());

                }
            } catch (Exception e) {
                System.out.println("Error encountered while parsing: " + e);
            }
        }
    }

    public static void parseMap(String path) {
        ObjectMapper objectMapper = new ObjectMapper();

        File input = new File(path);

        CsvParserSettings parserSettings = new CsvParserSettings();
        parserSettings.setMaxCharsPerColumn(1000000);
        //...configure the parser

        // You can also use TSV and Fixed-width routines
        CsvRoutines routines = new CsvRoutines(parserSettings);
        for (Mapping mapping : routines.iterate(Mapping.class, input, "UTF-8")) {
            try {
                counterMapping++;

                if (mapping.getRegion().equals("MA")) {

                    String category = mapping.getTop_category();
                    if (category != null) {
                        categories.add(category);
                    }
                    hashcodeMap.put(objectMapper.writeValueAsBytes(mapping.getSafegraph_place_id()),
                            objectMapper.writeValueAsBytes(mapping));
                }

                if (counterMapping % 10000 == 0) {
                    System.out.println(mapping);

                    Instant current = Instant.now();

                    System.out.println("Processed " + counterMapping + " elements.");
                    System.out.println("Time elapsed in seconds: " + Duration.between(startTimeMapping, current).getSeconds());

                }
            } catch (Exception e) {
                System.out.println("Error encountered while parsing: " + e);
            }
        }
    }

    public static void matchRecordMapping() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        for (Record record : listMARecords) {
            counterMatch++;
            String id = record.getSafegraph_place_id();

            byte[] resultMap = hashcodeMap.get(objectMapper.writeValueAsBytes(id));
            Mapping mapping = objectMapper.readValue(resultMap, Mapping.class);
            LocatedRecord locatedRecord = new LocatedRecord(record, mapping);
            listLocatedRecords.add(locatedRecord);

            if (counterMatch % 10000 == 0 || counterMatch == listMARecords.size()) {
                Instant current = Instant.now();
                System.out.println("Matched items: " + counterMatch + "/" + listMARecords.size());
                System.out.println("Time elapsed in seconds: " + Duration.between(startTimeMatching, current).getSeconds());
            }
        }
    }
}
