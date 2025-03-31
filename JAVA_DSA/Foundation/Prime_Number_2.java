package Foundation;

import java.util.Scanner;

public class Prime_Number_2 {

    public static void SolveProblem(int n1, int n2) {
        for (int i = n1; i <= n2; i++) {
            int count = 0;
            for (int j = 2; j * j <= i; j++) {
                if (i % j == 0) {
                    count++;
                    break;
                }
            }

            if (count == 0) {
                System.out.println(i);
            }
        }
    }

    public static void main(String[] args) throws Exception {
        Scanner scn = new Scanner(System.in);
        int n1 = scn.nextInt();
        int n2 = scn.nextInt();
        SolveProblem(n1, n2);
    }
}
